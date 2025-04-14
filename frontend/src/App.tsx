import React from 'react';
import FileUploader from './components/FileUploader/FileUploader';
import { Header } from './components/Header/Header';
import './App.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <FileUploader />
    </div>
  );
};

export default App;