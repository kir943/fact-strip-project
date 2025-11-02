
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
  const generateExplanation = async (fact) => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fact }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.explanation; 
      } else {
        throw new Error(data.error || 'Failed to generate explanation');
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      
      
      return {
        step1: `Let's examine the statement: "${fact}"`,
        step2: 'Researching scientific evidence and sources...',
        step3: 'Analyzing the available data and studies...',
        step4: 'Based on current scientific understanding...'
      };
    }
  };

  const addToHistory = async (result) => {
    
    const explanation = result.explanation;

    console.log('📦 Adding to history with explanation:', explanation);

    
    const historyItem = {
      id: result.id || Date.now(),
      timestamp: result.timestamp || new Date().toISOString(),
      statement: result.statement,
      verdict: result.verdict,
      confidence: result.confidence,
      description: result.description,
      mood: result.mood,
      moodConfidence: result.moodConfidence,
      comicImage: result.comicImage, 
      style: result.style,
      explanation: explanation 
    };

    const newHistory = [historyItem, ...history.slice(0, 49)]; 
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

  
  const regenerateExplanation = async (factId) => {
    const historyItem = history.find(item => item.id === factId);
    if (!historyItem) return null;

    try {
      console.log('🔄 Regenerating explanation for:', historyItem.statement);
      const explanation = await generateExplanation(historyItem.statement);
      
      const updatedHistory = history.map(item => 
        item.id === factId 
          ? { ...item, explanation }
          : item
      );
      
      setHistory(updatedHistory);
      
      try {
        localStorage.setItem('factStripHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      console.log('✅ Explanation regenerated successfully');
      return explanation;
    } catch (error) {
      console.error('Failed to regenerate explanation:', error);
      return null;
    }
  };


  const getHistoryItem = (factId) => {
    return history.find(item => item.id === factId);
  };

 
  const removeFromHistory = (factId) => {
    const updatedHistory = history.filter(item => item.id !== factId);
    setHistory(updatedHistory);
    
    try {
      localStorage.setItem('factStripHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    updateAnalytics(updatedHistory);
  };

  const value = {
    history,
    analytics,
    addToHistory,
    clearHistory,
    loading,
    setLoading,
    generateExplanation, 
    regenerateExplanation, 
    getHistoryItem, 
    removeFromHistory 
  };

  return (
    <FactContext.Provider value={value}>
      {children}
    </FactContext.Provider>
  );
};