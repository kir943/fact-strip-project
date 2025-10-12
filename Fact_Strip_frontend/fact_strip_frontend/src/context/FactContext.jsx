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
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        updateAnalytics(parsedHistory);
      } catch (error) {
        console.error('Error parsing saved history:', error);
        // Clear corrupted data
        localStorage.removeItem('factStripHistory');
      }
    }
  }, []);

  const updateAnalytics = (historyData) => {
    const analytics = {
      totalChecks: historyData.length,
      trueCount: historyData.filter(item => item.verdict?.toLowerCase() === 'true').length,
      falseCount: historyData.filter(item => item.verdict?.toLowerCase() === 'false').length,
      unverifiedCount: historyData.filter(item => 
        !item.verdict || 
        item.verdict?.toLowerCase() === 'unverified' || 
        !['true', 'false'].includes(item.verdict?.toLowerCase())
      ).length
    };
    setAnalytics(analytics);
  };

  const addToHistory = (result) => {
    // Create a clean history item with only necessary data
    const historyItem = {
      id: result.id || Date.now(),
      timestamp: result.timestamp || new Date().toISOString(),
      statement: result.statement,
      verdict: result.verdict,
      confidence: result.confidence,
      description: result.description,
      mood: result.mood,
      moodConfidence: result.moodConfidence,
      comicImage: result.comicImage, // Single comic image
      style: result.style
    };

    const newHistory = [historyItem, ...history.slice(0, 49)]; // Keep last 50 items
    setHistory(newHistory);
    
    try {
      localStorage.setItem('factStripHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    updateAnalytics(newHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    setAnalytics({ totalChecks: 0, trueCount: 0, falseCount: 0, unverifiedCount: 0 });
    
    try {
      localStorage.removeItem('factStripHistory');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
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