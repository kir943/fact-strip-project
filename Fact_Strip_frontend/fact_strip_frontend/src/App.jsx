import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavigationProvider } from './context/NavigationContext';
import { FactProvider } from './context/FactContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import FactCheck from './pages/FactCheck';
import History from './pages/History';
import About from './pages/About';
import './styles/App.css';

function App() {
  return (
    <NavigationProvider>
      <FactProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fact-check" element={<FactCheck />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
      </FactProvider>
    </NavigationProvider>
  );
}

export default App;
