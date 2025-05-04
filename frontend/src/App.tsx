import React, { useEffect } from 'react';
import './App.css';

import { getApi } from './services/api';

import { Header } from './components/Header/Header';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Footer } from './components/Footer/Footer';


const App: React.FC = () => {
  useEffect(() => { getApi() }, []);

  return (
    <div className="App">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default App;