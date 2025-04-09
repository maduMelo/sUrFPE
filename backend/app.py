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

        # Turn the file into a pandas DataFrame already treating the data
        df = process_csv(file)

        # Mean of the athlete results
        avg_score_per_surfer = df.groupby('Atleta')['Classificação'].mean()

        # Mean of the athlete trick perfomance
        trick_performance = df.groupby(['Atleta', 'Manobras'])[
            'Classificação'].agg(['mean']).reset_index()

        # Mean of the athlete trick perfomance by indicator
        indicator_trick_means = df.groupby(['Atleta', 'Manobras', 'Indicador Manobra'])[
            'Classificação'].mean().reset_index()

        # Count the number of tricks performed by each athlete and wave type
        tricks_count = df.groupby(['Atleta', 'wave_type'])[
            'Manobras'].count().reset_index()

        # Calculate the general mean results for each wave type
        wave_type_performance = df.groupby(['Atleta', 'wave_type'])[
            'Classificação'].mean().unstack()

        # Return the results as JSON to the client
        return jsonify({
            'message': f'File {file.filename} received successfully!',
            'general_mean_scores': avg_score_per_surfer.to_dict(),
            'tricks_mean_scores': trick_performance.to_dict(orient='records'),
            'indicator_trick_means_scores': indicator_trick_means.to_dict(orient='records'),
            'wave_type_tricks_count': tricks_count.to_dict(orient='records'),
            'wave_type_general_mean_scores': wave_type_performance.to_dict()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the CSV Analysis API!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
