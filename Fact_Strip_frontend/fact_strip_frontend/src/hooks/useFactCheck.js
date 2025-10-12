// src/hooks/useFactCheck.js
import { useState } from 'react';
import { useFact } from '../context/FactContext';
import axios from 'axios';

// ✅ Use localhost for testing (adjust if using deployed server)
const API_BASE_URL = 'http://127.0.0.1:5000'; // or your server IP if not local

export const useFactCheck = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { addToHistory, setLoading, loading } = useFact();

  const checkFact = async (statement, style) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🔹 Sending request to Flask backend...', { statement, style });

      // ✅ axios POST to your Flask route
      const response = await axios.post(
        `${API_BASE_URL}/api/generate`,
        { statement, style },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000, // 60 seconds to avoid "Network Error" on large AI tasks
        }
      );

      console.log('✅ Backend response:', response.data);

      // ✅ UPDATED: Backend now returns single comic image
      const resultData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        statement,
        style,
        ...response.data,
        comicImage: response.data.comicImage || null, // Single comic image
        // Remove panel_images since backend no longer returns it
        moodConfidence: response.data.moodConfidence ?? response.data.mood_confidence ?? null, // Support both formats
      };

      setResult(resultData);
      addToHistory(resultData);
      return resultData;
    } catch (err) {
      console.error('❌ API Error:', err);
      let errorMessage = 'Failed to process statement';
      if (err.response) errorMessage = err.response.data?.error || 'Server Error';
      else if (err.request) errorMessage = 'Network Error: Could not reach the backend';
      else errorMessage = err.message;

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