// src/pages/FactCheck.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFactCheck } from '../hooks/useFactCheck';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Brain,
  Image as ImageIcon,
  FileText,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Eye
} from 'lucide-react';

const FactCheck = () => {
  const [statement, setStatement] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('anime/manga');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { result, error, checkFact, isLoading } = useFactCheck();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!statement.trim()) return;

    setIsSubmitted(true);
    try {
      await checkFact(statement, selectedStyle);
    } catch (err) {
      console.error('Fact check failed:', err);
    }
  };

  return (
    <div className="stunning-fact-check-page">
      {/* Beautiful Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero-section"
      >
        <div className="hero-background">
          <div className="hero-glow"></div>
        </div>
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-icon"
          >
            <Shield className="w-12 h-12" />
          </motion.div>
          <h1 className="hero-title">
            <span className="gradient-text">Fact Check</span>
            <Sparkles className="sparkle-icon" />
          </h1>
          <p className="hero-subtitle">
            Verify any claim with AI-powered analysis and beautiful visual storytelling
          </p>
        </div>
      </motion.section>

      {/* Elegant Input Card */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="input-section"
      >
        <div className="elegant-input-card">
          <div className="card-header">
            <div className="header-icon">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="card-title">Check a Statement</h2>
              <p className="card-description">Enter any claim to verify its accuracy</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="elegant-form">
            <div className="form-group">
              <label className="form-label">
                <Eye className="w-4 h-4" />
                Enter a statement to verify:
              </label>
              <div className="input-wrapper">
                <textarea
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="moon gives light"
                  className="elegant-textarea"
                  rows="3"
                />
                <div className="input-decoration"></div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <ImageIcon className="w-4 h-4" />
                Select Comic Style:
              </label>
              <div className="style-grid">
                {[
                  { value: 'anime/manga', label: 'Anime/Manga', icon: '🎨' },
                  { value: 'newspaper', label: 'Newspaper', icon: '📰' },
                  { value: 'normal', label: 'Normal', icon: '✨' }
                ].map((style) => (
                  <motion.button
                    key={style.value}
                    type="button"
                    className={`style-card ${selectedStyle === style.value ? 'selected' : ''}`}
                    onClick={() => setSelectedStyle(style.value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="style-icon">{style.icon}</div>
                    <span className="style-label">{style.label}</span>
                    {selectedStyle === style.value && (
                      <motion.div
                        layoutId="styleSelection"
                        className="selection-indicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !statement.trim()}
              className="submit-button"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Analyzing Statement...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate Fact-Strip</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="error-card"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Stunning Results Section */}
      <AnimatePresence>
        {(isSubmitted && (isLoading || result)) && (
          <motion.section
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="results-section"
          >
            <div className="results-container">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="loading-state"
                  >
                    <div className="loading-content">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="loading-orb"
                      >
                        <Sparkles className="w-8 h-8" />
                      </motion.div>
                      <h3 className="loading-title">Analyzing Your Statement</h3>
                      <p className="loading-description">
                        We're carefully examining the statement, detecting mood patterns, 
                        and preparing your visual fact-strip...
                      </p>
                      <div className="loading-progress">
                        <motion.div 
                          className="progress-bar"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="results-content"
                  >
                    {/* Results Header */}
                    <motion.div 
                      className="results-header"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="results-title-section">
                        <BarChart3 className="w-8 h-8" />
                        <div>
                          <h2 className="results-title">Analysis Results</h2>
                          <p className="results-subtitle">Complete breakdown of our fact-checking process</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`verdict-badge ${result.verdict?.toLowerCase()}`}
                      >
                        {result.verdict?.toUpperCase()}
                      </motion.div>
                    </motion.div>

                    {/* Main Verdict Card */}
                    <motion.section 
                      className="verdict-section"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="verdict-card">
                        <div className="verdict-main">
                          <div className="verdict-icon-container">
                            {result.verdict?.toLowerCase() === 'true' ? (
                              <CheckCircle className="w-12 h-12" />
                            ) : (
                              <XCircle className="w-12 h-12" />
                            )}
                          </div>
                          <div className="verdict-content">
                            <h3 className="verdict-statement">
                              This statement is <span className="verdict-highlight">{result.verdict?.toUpperCase()}</span>
                            </h3>
                            <div className="confidence-display">
                              <div className="confidence-info">
                                <span className="confidence-value">{result.confidence}%</span>
                                <span className="confidence-label">confidence score</span>
                              </div>
                              <div className="confidence-bar">
                                <motion.div 
                                  className="confidence-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${result.confidence}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  style={{
                                    backgroundColor: result.verdict?.toLowerCase() === 'true' ? 
                                      'var(--true-color)' : 'var(--false-color)'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.section>

                    {/* Info Grid */}
                    <div className="info-grid">
                      {/* Description */}
                      <motion.div 
                        className="info-card"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <div className="info-header">
                          <FileText className="w-6 h-6" />
                          <h3>Description</h3>
                        </div>
                        <div className="info-content">
                          <p>{result.description}</p>
                        </div>
                      </motion.div>

                      {/* Mood Detection */}
                      <motion.div 
                        className="info-card"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <div className="info-header">
                          <Brain className="w-6 h-6" />
                          <h3>Mood Detection</h3>
                        </div>
                        <div className="info-content">
                          <div className="mood-display">
                            <div className="mood-info">
                              <span className="mood-label">Detected Mood:</span>
                              <span className="mood-value">{result.mood}</span>
                            </div>
                            <div className="confidence-display">
                              <div className="confidence-info">
                                <span className="confidence-value">{result.moodConfidence}%</span>
                                <span className="confidence-label">confidence</span>
                              </div>
                              <div className="confidence-bar">
                                <motion.div 
                                  className="confidence-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${result.moodConfidence}%` }}
                                  transition={{ duration: 1, delay: 0.7 }}
                                  style={{ backgroundColor: 'var(--primary)' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Visual Fact-Strip - SINGLE COMIC IMAGE (4 panels inside it) */}
                    <motion.section 
                      className="comic-section"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="section-header">
                        <ImageIcon className="w-6 h-6" />
                        <h3>Visual Fact-Strip</h3>
                      </div>

                      <div className="comic-display single-image">
                        {result.comicImage ? (
                          <motion.div
                            className="comic-panel"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <img 
                              src={result.comicImage}
                              alt="Generated Comic"
                              className="panel-image single"
                            />
                            <div className="comic-overlay">
                              <span className="comic-style">{selectedStyle} Style</span>
                              <span className="comic-ai">AI Generated</span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="no-image-placeholder">
                            <p>Comic not generated yet</p>
                          </div>
                        )}
                      </div>
                    </motion.section>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isSubmitted && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="empty-state"
        >
          <div className="empty-content">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="empty-icon"
            >
              <Sparkles className="w-16 h-16" />
            </motion.div>
            <h3>Ready to Discover the Truth?</h3>
            <p>Enter a statement above to start the fact-checking magic</p>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default FactCheck;