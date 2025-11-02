import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <motion.div
      className={`spinner ${sizes[size]}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default LoadingSpinner;