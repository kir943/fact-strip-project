import React from 'react';
import { motion } from 'framer-motion';

const StyleSelector = ({ selectedStyle, onStyleChange }) => {
  const styles = [
    { value: 'anime/manga', icon: 'fas fa-user-ninja', label: 'Anime/Manga' },
    { value: 'newspaper', icon: 'fas fa-newspaper', label: 'Newspaper' },
    { value: 'normal', icon: 'fas fa-palette', label: 'Normal' },
  ];

  return (
    <div className="form-group">
      <label>Select Comic Style:</label>
      <div className="style-selector">
        {styles.map((style) => (
          <motion.div
            key={style.value}
            className={`style-option ${selectedStyle === style.value ? 'selected' : ''}`}
            onClick={() => onStyleChange(style.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={style.icon}></i>
            <div>{style.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;