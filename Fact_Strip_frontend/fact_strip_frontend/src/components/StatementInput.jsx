import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFact } from '../context/FactContext';

const StatementInput = ({ value, onChange, placeholder, onGenerate }) => {
  const { setLoading } = useFact();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    setIsGenerating(true);
    setLoading(true);

    try {
      await onGenerate(value.trim());
    } catch (error) {
      console.error('Error generating fact check:', error);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="statement-input-container">
      <form onSubmit={handleSubmit} className="statement-form">
        <div className="form-group">
          <label htmlFor="statement" className="form-label">
            <i className="fas fa-search"></i>
            Enter a statement to verify:
          </label>
          <motion.textarea
            id="statement"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder || "Example: 'Water is blue because it reflects the sky'"}
            className="statement-textarea"
            whileFocus={{ scale: 1.02 }}
            disabled={isGenerating}
            rows="3"
          />
          <div className="input-hint">
            <i className="fas fa-lightbulb"></i>
            Press Ctrl+Enter to quickly submit
          </div>
        </div>

        <motion.button
          type="submit"
          className={`generate-button ${isGenerating ? 'generating' : ''}`}
          disabled={!value.trim() || isGenerating}
          whileHover={{ scale: !value.trim() || isGenerating ? 1 : 1.05 }}
          whileTap={{ scale: !value.trim() || isGenerating ? 1 : 0.95 }}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating Fact-Strip...
            </>
          ) : (
            <>
              <i className="fas fa-bolt"></i>
              Generate Fact-Strip
            </>
          )}
        </motion.button>
      </form>

      {/* Example statements */}
      <div className="example-statements">
        <p className="examples-title">Try these examples:</p>
        <div className="example-chips">
          {[
            "Water is blue because it reflects the sky",
            "Bulls hate the color red",
            "Glass is a slow-moving liquid",
            "Lightning never strikes the same place twice"
          ].map((example, index) => (
            <motion.button
              key={index}
              className="example-chip"
              onClick={() => onChange(example)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isGenerating}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatementInput;