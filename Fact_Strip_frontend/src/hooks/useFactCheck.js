import { useState } from 'react';
import { useFact } from '../context/FactContext';
import axios from 'axios';

// Fix: Remove any trailing slashes from the API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || '';

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
      console.log('🔹 API Base URL:', API_BASE_URL); // Debug log

      const response = await axios.post(
        `${API_BASE_URL}/api/generate`, // This will now work correctly
        { statement, style },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        }
      );

      console.log('✅ Backend response:', response.data);

      const resultData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        statement,
        style,
        ...response.data,
        comicImage: response.data.comicImage || null,
        moodConfidence: response.data.moodConfidence ?? response.data.mood_confidence ?? null,
      };

      setResult(resultData);
      addToHistory(resultData);
      return resultData;
    } catch (err) {
      console.error('❌ API Error:', err);
      let errorMessage = 'Failed to process statement';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 'Server Error';
      } else if (err.request) {
        errorMessage = 'Network Error: Could not reach the backend';
      } else {
        errorMessage = err.message;
      }

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