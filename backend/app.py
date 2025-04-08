# app.py
from flask import Flask, request, jsonify
import pandas as pd
import io
from flask_cors import CORS

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

        # Read the CSV file into a DataFrame
        df = pd.read_csv(file)

        classification_map = {
            '4. Perfeito': 1.0,
            '3. Quase Perfeito': 0.75,
            '2. Imperfeito': 0.45,
            '1. Falha na Realização': 0.25,
            'Impossível Analisar': 0
        }

        # Apply the mapping to your column
        df['Classificação'] = df['Classificação'].map(classification_map)

        # Mean of the athlete results
        avg_score_per_surfer = df.groupby('Atleta')['Classificação'].mean()

        return jsonify({
            'message': f'File {file.filename} received successfully!',
            'mean_scores': avg_score_per_surfer.to_dict()
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the CSV Analysis API!'}), 200


if __name__ == '__main__':
    app.run(debug=True)
