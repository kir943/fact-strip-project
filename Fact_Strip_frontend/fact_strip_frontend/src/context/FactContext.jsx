// src/context/FactContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const FactContext = createContext();

export const useFact = () => {
  const context = useContext(FactContext);
  if (!context) {
    throw new Error('useFact must be used within a FactProvider');
  }
  return context;
};

export const FactProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalChecks: 0,
    trueCount: 0,
    falseCount: 0,
    unverifiedCount: 0
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem('factStripHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      updateAnalytics(parsedHistory);
    }
  }, []);

  const updateAnalytics = (historyData) => {
    const analytics = {
      totalChecks: historyData.length,
      trueCount: historyData.filter(item => item.verdict === 'true').length,
      falseCount: historyData.filter(item => item.verdict === 'false').length,
      unverifiedCount: historyData.filter(item => item.verdict === 'unverified').length
    };
    setAnalytics(analytics);
  };

  const addToHistory = (result) => {
    const newHistory = [result, ...history.slice(0, 49)]; // Keep last 50 items
    setHistory(newHistory);
    localStorage.setItem('factStripHistory', JSON.stringify(newHistory));
    updateAnalytics(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    setAnalytics({ totalChecks: 0, trueCount: 0, falseCount: 0, unverifiedCount: 0 });
    localStorage.removeItem('factStripHistory');
  };

  const value = {
    history,
    analytics,
    addToHistory,
    clearHistory,
    loading,
    setLoading
  };

  return (
    <FactContext.Provider value={value}>
      {children}
    </FactContext.Provider>
  );
};