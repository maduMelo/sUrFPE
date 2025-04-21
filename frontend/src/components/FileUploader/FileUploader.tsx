import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './FileUploader.css';

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  // const API_URL = 'https://meom.pythonanywhere.com';
  const API_URL = 'http://127.0.0.1:5000';

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const uploadFile = async () => {
    if (!file) return;

    setIsLoading(true);
    setApiResponse('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `${API_URL}/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Format the response as pretty-printed JSON if it's an object
      if (typeof response.data === 'object') {
        setApiResponse(JSON.stringify(response.data, null, 2));
      } else {
        setApiResponse(response.data.toString());
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error analyzing file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="file-uploader-container">
      <h2>Surf athlete analysis</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          {isDragActive ? (
            <p className="dropzone-text">Drop the CSV file here...</p>
          ) : (
            <>
              <p className="dropzone-text">Drag & drop a CSV file here</p>
              <p className="dropzone-subtext">or click to browse files</p>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="file-actions">
          <p className="file-info">Selected file: <strong>{file.name}</strong></p>
          <button
            onClick={uploadFile}
            disabled={isLoading}
            className="analyze-button"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze CSV'
            )}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {(apiResponse || isLoading) && (
        <div className="response-section">
          <h3>Analysis Results:</h3>
          {isLoading ? (
            <div className="loading-placeholder">
              <span className="spinner"></span>
              <p>Processing your file...</p>
            </div>
          ) : (
            <textarea
              className="response-textarea"
              value={apiResponse}
              readOnly
              placeholder="Analysis results will appear here..."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;