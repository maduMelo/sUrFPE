import React from 'react';
import { Header } from './components/Header/Header';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Footer } from './components/Footer/Footer';
import './App.css';


const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
};

export default App;