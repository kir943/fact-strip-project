import React from 'react';
import { motion } from 'framer-motion';
import { useFact } from '../context/FactContext';
import { Trash2, Calendar, Search, Check, X, HelpCircle, BarChart3 } from 'lucide-react';

const History = () => {
  const { history, clearHistory, analytics } = useFact();

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'true':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'false':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'true': return 'var(--true-color)';
      case 'false': return 'var(--false-color)';
      default: return 'var(--unverified-color)';
    }
  };

  // Add safety check for history
  if (!history || history.length === 0) {
    return (
      <div className="history-page">
        <div className="page-header">
          <h1>Fact-Check History</h1>
          <p className="page-subtitle">Your past fact-checking results will appear here</p>
        </div>
        <div className="empty-history">
          <div className="empty-icon">
            <Search className="w-20 h-20 text-gray-300 mb-6" />
          </div>
          <h3 className="empty-title">No history yet</h3>
          <p className="empty-description">Start fact-checking statements to see your history here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Fact-Check History</h1>
        <p className="page-subtitle">Review your past fact-checking results and analysis</p>
      </div>

      {/* Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="analytics-section"
      >
        <div className="section-header">
          <BarChart3 className="w-5 h-5" />
          <h2>Analytics Overview</h2>
        </div>
        <div className="analytics-grid">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-card"
          >
            <div className="analytics-value">{analytics.totalChecks}</div>
            <div className="analytics-label">Total Checks</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-card"
          >
            <div className="analytics-value" style={{ color: 'var(--true-color)' }}>
              {analytics.trueCount}
            </div>
            <div className="analytics-label">True Statements</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-card"
          >
            <div className="analytics-value" style={{ color: 'var(--false-color)' }}>
              {analytics.falseCount}
            </div>
            <div className="analytics-label">False Statements</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-card"
          >
            <div className="analytics-value" style={{ color: 'var(--unverified-color)' }}>
              {analytics.unverifiedCount}
            </div>
            <div className="analytics-label">Unverified</div>
          </motion.div>
        </div>
      </motion.div>

      {/* History Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="history-actions"
      >
        <motion.button
          onClick={clearHistory}
          className="clear-history-btn"
          whileHover={{ scale: 1.05, backgroundColor: 'var(--false-color)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 className="w-4 h-4" />
          Clear All History
        </motion.button>
      </motion.div>

      {/* History List */}
      <div className="history-section">
        <div className="section-header">
          <Calendar className="w-5 h-5" />
          <h2>Past Fact Checks ({history.length})</h2>
        </div>
        
        <div className="history-list">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="history-item"
            >
              <div className="history-item-header">
                <div className="verdict-section">
                  <div 
                    className="verdict-badge" 
                    style={{ backgroundColor: getVerdictColor(item.verdict) }}
                  >
                    {getVerdictIcon(item.verdict)}
                    <span>{item.verdict?.toUpperCase() || 'UNVERIFIED'}</span>
                  </div>
                  <div className="confidence-indicator">
                    <div 
                      className="confidence-bar"
                      style={{ 
                        width: `${item.confidence || 0}%`,
                        backgroundColor: getVerdictColor(item.verdict)
                      }}
                    />
                    <span>{item.confidence || 0}% confidence</span>
                  </div>
                </div>
                <div className="history-date">
                  <Calendar className="w-4 h-4" />
                  {item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Unknown date'}
                </div>
              </div>
              
              <div className="history-content">
                <div className="history-statement">
                  "{item.statement || 'No statement available'}"
                </div>
                
                <div className="history-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Mood Analysis:</span>
                    <span className="detail-value">
                      {item.mood || 'neutral'} ({item.moodConfidence || 0}%)
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Writing Style:</span>
                    <span className="detail-value">{item.style || 'normal'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fact Check ID:</span>
                    <span className="detail-value monospace">
                      {/* FIXED: Convert id to string before using slice */}
                      {String(item.id || '').slice(0, 8)}...
                    </span>
                  </div>
                </div>

                {item.comicImage && (
                  <div className="history-comic">
                    <div className="comic-label">Generated Comic Strip</div>
                    <img 
                      src={item.comicImage} 
                      alt="Generated comic" 
                      className="comic-thumbnail" 
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;