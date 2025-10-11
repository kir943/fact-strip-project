import React from 'react';
import { motion } from 'framer-motion';

const StatementInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="form-group">
      <label htmlFor="statement">Enter a statement to verify:</label>
      <motion.textarea
        id="statement"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="statement-textarea"
        whileFocus={{ scale: 1.02 }}
      />
    </div>
  );
};

export default StatementInput;