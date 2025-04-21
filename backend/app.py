# app.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from flask_cors import CORS


# Function definitions
def process_csv(file):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(file)

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


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024


@app.route('/analyze', methods=['POST'])
def analyze_csv():
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        # Check if file is CSV
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400

        # Check if the columns are correct

        # Turn the file into a pandas DataFrame already treating the data
        df = process_csv(file)

        # Mean of the athlete results
        avg_score_per_surfer = df.groupby('Atleta')['Classificação'].mean()
        general_mean_scores = [{'surfer': surfer, 'score': round(score*100, 2)}
                               for surfer, score in avg_score_per_surfer.items()]

        # Mean of the athlete trick perfomance
        trick_performance = df.groupby(['Atleta', 'Manobras'])[
            'Classificação'].agg(['mean']).reset_index()
        tricks_mean_scores = {
            "athlete": trick_performance['Atleta'].iloc[0],
            "tricks": trick_performance['Manobras'].tolist(),
            "scores": [round(score * 100, 2) for score in trick_performance['mean']]
        }

        # Mean
        tricks_performance_by_wave_type = get_wave_type_trick_scores(df)

        # Mean of the athlete trick perfomance by indicator
        indicator_trick_means = get_tricks_metrics_analysis(df)

        # Count the number of tricks performed by each athlete and wave type
        tricks_count = df.groupby(['wave_type'])[
            'Manobras'].count().reset_index()
        tricks_count_final = {
            "wave_types": ["frontside", "backside"],
            "counts": tricks_count['Manobras'].tolist()[::-1]
        }

        # Calculate the general mean results for each wave type
        wave_type_performance = df.groupby(['Atleta', 'wave_type'])[
            'Classificação'].mean().unstack()

        # Return the results as JSON to the client
        return jsonify({
            'tricks_performance_by_wave_type': tricks_performance_by_wave_type,
            'tricks_mean_scores': tricks_mean_scores,
            'indicator_trick_means_scores': indicator_trick_means,

            'wave_type_tricks_count': tricks_count_final,
            # 'wave_type_general_mean_scores': wave_type_performance.to_dict()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the CSV Analysis API!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
