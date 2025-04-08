import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';


const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const API_URL = 'https://meom.pythonanywhere.com';
  const API_URL = 'http://127.0.0.1:5000';

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
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

    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here...</p>
        ) : (
          <p>Drag & drop a CSV file here, or click to select</p>
        )}
      </div>

      {file && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
          <button onClick={uploadFile} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze CSV'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;