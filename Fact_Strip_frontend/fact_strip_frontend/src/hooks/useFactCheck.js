// src/hooks/useFactCheck.js
import { useState } from 'react';
import { useFact } from '../context/FactContext';
import axios from 'axios';

// ✅ Your Flask backend URL
const API_BASE_URL = 'http://128.10.44.102:5000';

export const useFactCheck = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { addToHistory, setLoading, loading } = useFact();

  const checkFact = async (statement, style) => {
    setLoading(true);
    setError(null);
    setResult(null); // Clear previous results

    try {
      console.log('Sending request to Flask backend...', { statement, style });
      
      // ✅ CALL YOUR FLASK ENDPOINT
      const response = await axios.post(`${API_BASE_URL}/api/generate`, {
        statement,
        style,
      });

      console.log('Backend response:', response.data);

      // ✅ MAP BACKEND FIELDS TO FRONTEND EXPECTATIONS
      const resultData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        statement,
        style,
        // Map backend field names to frontend expected names
        comicImage: response.data.comic_url, // Backend sends 'comic_url', frontend expects 'comicImage'
        moodConfidence: response.data.mood_confidence, // Backend sends 'mood_confidence', frontend expects 'moodConfidence'
        // Include all other backend fields as-is
        ...response.data,
      };

      setResult(resultData);
      addToHistory(resultData);
      return resultData;
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage =
        err.response?.data?.error || err.message || 'Failed to process statement';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setError(null);
  };

  return { result, error, checkFact, isLoading: loading, clearResult };
};