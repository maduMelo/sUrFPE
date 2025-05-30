# app.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
from google import genai


# load .env varibales
load_dotenv()

# Function definitions

def check_file_requirements(request):
    # Check if file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    # Check if file is CSV
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'File must be a CSV'}), 500
    
    df = pd.read_csv(file)

    # Check if the CSV has all required columns
    required_columns = {'Lado Onda', 'Atleta', 'Classificação', 'Indicador Manobra', 'Manobras', 'Base do Surfista'}
    if not required_columns.issubset(set(df.columns)):
        return jsonify({'error': 'CSV file is missing required columns'}), 500
    
    # Check if there's only one athlete
    first_value = df['Atleta'].iloc[0]
    is_data_of_only_one_athlete = (df['Atleta'] == first_value).all()
    if not is_data_of_only_one_athlete:
        return jsonify({'error': 'CSV file contains data of too many athletes'}), 500

    return df


def process_csv(df):
    # Change the values on Classificação column to float
    classification_map = {
        '4. Perfeito': 1.0,
        '3. Quase Perfeito': 0.75,
        '2. Imperfeito': 0.45,
        '1. Falha na Realização': 0.25,
        'Impossível Analisar': 0
    }
    df['Classificação'] = df['Classificação'].map(classification_map)

    # Defining if it was a Frontside wave or Backside
    df['wave_type'] = np.where(
        ((df['Lado Onda'] == 'D') & (df['Base do Surfista'] == 'Regular')) |
        ((df['Lado Onda'] == 'E') & (df['Base do Surfista'] == 'Goofy')),
        'Front Side',
        'Back Side'
    )

    # Removing rows where the classification is NaN
    df = df.dropna(subset=['Classificação'])

    return df


def get_wave_type_trick_scores(df):
    df_result = df.groupby(['Manobras', 'wave_type'])[
        'Classificação'].mean().reset_index()

    unique_tricks = df_result['Manobras'].unique().tolist()
    frontside, backside = [0] * len(unique_tricks), [0] * len(unique_tricks)

    for index, trick in enumerate(unique_tricks):
        # Check for Front Side
        fs_data = df_result[(df_result['Manobras'] == trick) & (
            df_result['wave_type'] == 'Front Side')]
        if not fs_data.empty:
            # Convert to percentage and round to 2 decimal places
            frontside[index] = round(
                fs_data['Classificação'].values[0] * 100, 2)

        # Check for Back Side
        bs_data = df_result[(df_result['Manobras'] == trick) & (
            df_result['wave_type'] == 'Back Side')]
        if not bs_data.empty:
            # Convert to percentage and round to 2 decimal places
            backside[index] = round(
                bs_data['Classificação'].values[0] * 100, 2)

    return {
        "tricks": unique_tricks,
        "frontside": frontside,
        "backside": backside
    }


def get_tricks_metrics_analysis(df):
    tricks = df['Manobras'].unique().tolist()
    result = {
        "tricks": tricks,
        "chartsInfo": []
    }

    for trick in tricks:
        # Filter data for the current trick
        trick_data = df[df['Manobras'] == trick]

        # Get metrics for this trick
        metrics = trick_data['Indicador Manobra'].unique().tolist()

        # Initialize lists for backside, frontside, and total scores
        backside_scores = []
        frontside_scores = []
        total_scores = []

        # For each metric, calculate the scores
        for metric in metrics:
            # Get backside score (average if multiple entries exist)
            bs_score = trick_data[(trick_data['Indicador Manobra'] == metric) &
                                  (trick_data['wave_type'] == 'Back Side')]['Classificação'].mean()
            bs_score = bs_score if not pd.isna(bs_score) else 0

            # Get frontside score (average if multiple entries exist)
            fs_score = trick_data[(trick_data['Indicador Manobra'] == metric) &
                                  (trick_data['wave_type'] == 'Front Side')]['Classificação'].mean()
            fs_score = fs_score if not pd.isna(fs_score) else 0

            # Calculate total score (you can adjust this calculation as needed)
            total_score = (bs_score + fs_score) / 2 if (bs_score !=
                                                        0 and fs_score != 0) else max(bs_score, fs_score)

            # Convert to percentages (assuming original scores are between 0-1)
            backside_scores.append(round(bs_score * 100))
            frontside_scores.append(round(fs_score * 100))
            total_scores.append(round(total_score * 100))

        # Add to chartsInfo
        result["chartsInfo"].append({
            "metrics": metrics,
            "backside": backside_scores,
            "frontside": frontside_scores,
            "total": total_scores
        })

    return result


def get_AI_feedback(statistical_analysis):
    gemini_key = os.getenv('GEMINI_API_KEY')
    client = genai.Client(api_key=gemini_key)

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=f"generate a feedback based on this statistical analysis of the training session {statistical_analysis}, answer in brazilian portuguese as a surfer trainer professional be concise on the answer but make sure to point out where the athlete is doing well and where there's space for improvement and how he can get better, use a kind tone but as you are talking to an adult, use markdown for your answer and this feedback as example 'Geovane, parabéns pelo seu desempenho no Drop, com uma média de 91.11! Sua execução no Bottom Turn BS também está sólida, com 85.71. Pontos Fortes: Drop: Ótima performance! Continue mantendo essa consistência. Bottom Turn BS: Bom direcionamento e rotação. Áreas para Melhoria: Bottom Turn FS e Carve FS: A média está mais baixa (59.13 e 68.61, respectivamente). É importante focar em: Olhar: Direcione o olhar para onde você quer ir. Centro de Gravidade: Mantenha o equilíbrio e a postura correta. Base: Posição de corrida firme e estável. Uso dos Braços: Lance o braço de trás para gerar mais rotação e utilize o braço da frente para equilíbrio. Distribuição de Peso: Distribua o peso corretamente para ter mais controle da prancha. Engajamento da Borda: Use a borda interna e externa para direcionar a prancha com mais precisão. Recomendações: Treino Específico: Dedique tempo para praticar especificamente o Bottom Turn FS e o Carve FS. Vídeo Análise: Analise vídeos seus executando essas manobras para identificar pontos específicos a serem corrigidos. Simulações: Pratique os movimentos fora da água para internalizar a técnica. Com foco e prática, você pode aprimorar essas áreas e elevar ainda mais seu surf!'"
    )

    return response.text


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024


@app.route('/analyze', methods=['POST'])
def analyze_csv():
    try:
        df = check_file_requirements(request)
        processed_df = process_csv(df)

        # Mean of the athlete results
        avg_score_per_surfer = processed_df.groupby('Atleta')['Classificação'].mean()
        general_mean_scores = [{'surfer': surfer, 'score': round(score*100, 2)}
                               for surfer, score in avg_score_per_surfer.items()]

        # Mean of the athlete trick perfomance
        trick_performance = processed_df.groupby(['Atleta', 'Manobras'])[
            'Classificação'].agg(['mean']).reset_index()
        tricks_mean_scores = {
            "athlete": trick_performance['Atleta'].iloc[0],
            "tricks": trick_performance['Manobras'].tolist(),
            "scores": [round(score * 100, 2) for score in trick_performance['mean']]
        }

        # Mean
        tricks_performance_by_wave_type = get_wave_type_trick_scores(processed_df)

        # Mean of the athlete trick perfomance by indicator
        indicator_trick_means = get_tricks_metrics_analysis(processed_df)

        # Count the number of tricks performed by each athlete and wave type
        tricks_count = processed_df.groupby(['wave_type'])[
            'Manobras'].count().reset_index()
        tricks_count_final = {
            "wave_types": ["frontside", "backside"],
            "counts": tricks_count['Manobras'].tolist()[::-1]
        }

        # Calculate the general mean results for each wave type
        wave_type_performance = processed_df.groupby(['Atleta', 'wave_type'])[
            'Classificação'].mean().unstack()

        # Return the results as JSON to the client
        return jsonify({
            'tricks_performance_by_wave_type': tricks_performance_by_wave_type,
            'tricks_mean_scores': tricks_mean_scores,
            'indicator_trick_means_scores': indicator_trick_means,
            'wave_type_tricks_count': tricks_count_final,
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/feedback', methods=['POST'])
def ai_feedback():
    try:
        json_data = request.get_json()

        if json_data is None:
            return jsonify({'error': 'No JSON data received'}), 400

        ai_feedback = get_AI_feedback(json_data)

        return jsonify({'feedback': ai_feedback}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the sUrFPE athlete analysis API!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
