// src/components/ResultPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, ThumbsUp, ThumbsDown } from 'lucide-react';

const ResultPanel = ({ result }) => {
  const {
    verdict,
    confidence,
    mood,
    moodConfidence, // Fixed: was mood_confidence
    description,
    comicImage, // CHANGED: Now using comicImage (single image) instead of panel_images
    explanation, // NEW: Scientific explanations
    style
  } = result;

  const getVerdictConfig = (verdict) => {
    switch (verdict) {
      case 'true':
        return {
          icon: 'fas fa-check',
          color: 'var(--true-color)',
          text: 'This statement is TRUE',
          bgColor: 'rgba(76, 217, 100, 0.1)'
        };
      case 'false':
        return {
          icon: 'fas fa-times',
          color: 'var(--false-color)',
          text: 'This statement is FALSE',
          bgColor: 'rgba(255, 59, 48, 0.1)'
        };
      default:
        return {
          icon: 'fas fa-question',
          color: 'var(--unverified-color)',
          text: 'This statement is UNVERIFIED',
          bgColor: 'rgba(255, 149, 0, 0.1)'
        };
    }
  };

  const verdictConfig = getVerdictConfig(verdict);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fact-Strip Analysis',
          text: `I fact-checked: "${result.statement}" - Verdict: ${verdict.toUpperCase()}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Fact-Strip Analysis: "${result.statement}" - Verdict: ${verdict.toUpperCase()} - ${window.location.href}`
      );
      alert('Results copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // Download the comic image
    if (comicImage) {
      const link = document.createElement('a');
      link.href = comicImage;
      link.download = `fact-strip-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="result-panel">
      {/* Verdict Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="verdict-section"
        style={{ backgroundColor: verdictConfig.bgColor, borderLeftColor: verdictConfig.color }}
      >
        <div className="verdict-header">
          <div className="verdict">
            <div className="verdict-icon" style={{ backgroundColor: verdictConfig.color }}>
              <i className={verdictConfig.icon}></i>
            </div>
            <div>
              <div className="verdict-text" style={{ color: verdictConfig.color }}>
                {verdictConfig.text}
              </div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${confidence}%`, 
                    backgroundColor: verdictConfig.color 
                  }}
                ></div>
              </div>
              <div className="confidence-text">{confidence}% confidence</div>
            </div>
          </div>
          
          <div className="action-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="action-btn"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            {comicImage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="action-btn"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scientific Explanation Section - NEW */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="scientific-explanation-section"
        >
          <div className="info-title">
            <i className="fas fa-microscope"></i>
            Scientific Explanation
          </div>
          <div className="explanation-steps">
            <div className="explanation-step">
              <div className="step-number">1</div>
              <div className="step-content">{explanation.step1}</div>
            </div>
            <div className="explanation-step">
              <div className="step-number">2</div>
              <div className="step-content">{explanation.step2}</div>
            </div>
            <div className="explanation-step">
              <div className="step-number">3</div>
              <div className="step-content">{explanation.step3}</div>
            </div>
            <div className="explanation-step">
              <div className="step-number">4</div>
              <div className="step-content">{explanation.step4}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Grid */}
      <div className="info-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="info-box"
        >
          <div className="info-title">
            <i className="fas fa-info-circle"></i>
            Analysis Details
          </div>
          <div className="analysis-details">
            {description}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="info-box"
        >
          <div className="info-title">
            <i className="fas fa-smile"></i>
            Mood Detection
          </div>
          <div className="mood-indicator">
            <div className="mood-label">Detected Mood:</div>
            <div className="mood-value">{mood}</div>
          </div>
          <div className="confidence-bar">
            <div 
              className="confidence-fill" 
              style={{ width: `${moodConfidence}%` }}
            ></div>
          </div>
          <div className="confidence-text">{moodConfidence}% confidence</div>
        </motion.div>
      </div>

      {/* Comic Section - UPDATED FOR SINGLE IMAGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="comic-section"
      >
        <div className="comic-header">
          <div className="info-title">
            <i className="fas fa-images"></i>
            Visual Fact-Strip
            {style && <span className="style-badge">{style} style</span>}
          </div>
          <div className="comic-actions">
            <button className="feedback-btn">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="feedback-btn">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="comic-container">
          {comicImage ? (
            <div className="comic-strip-single">
              <img 
                src={comicImage} 
                alt="Fact-check comic strip" 
                className="comic-image-single"
              />
              <div className="comic-caption">
                AI-generated comic with scientific explanations in speech bubbles
              </div>
            </div>
          ) : (
            <div className="comic-placeholder">
              <i className="fas fa-exclamation-triangle"></i>
              <p>Comic generation failed. Please try again.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPanel;