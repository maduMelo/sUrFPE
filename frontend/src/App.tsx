import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CSV File Analyzer</h1>
      </header>
      <main>
        <FileUploader />
      </main>
    </div>
  );
};

export default App;