import React from 'react';
import { motion } from 'framer-motion';
import { Home, History, Info, FileText } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const Navigation = () => {
  const { currentPage, setCurrentPage } = useNavigation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'fact-check', label: 'Fact Check', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <nav className="navigation">
      {/* Logo/Brand */}
      <motion.div 
        className="brand"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="logo">
          <FileText className="logo-icon" />
          <span className="brand-name">FACT STRIP</span>
        </div>
      </motion.div>

      {/* Navigation Items */}
      <div className="nav-container">
        <ul className="nav-list">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="nav-item"
              >
                <motion.button
                  onClick={() => setCurrentPage(item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;