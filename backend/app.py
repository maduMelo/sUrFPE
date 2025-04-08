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

        return jsonify({'message': f'file {file.filename} received successfully!'})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
