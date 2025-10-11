import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, History, Info, FileText } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/', label: 'Home', icon: Home },
    { id: 'fact-check', path: '/fact-check', label: 'Fact Check', icon: FileText },
    { id: 'history', path: '/history', label: 'History', icon: History },
    { id: 'about', path: '/about', label: 'About', icon: Info }
  ];

  return (
    <nav className="navigation">
      {/* Logo/Brand */}
      <div className="brand">
        <Link to="/" className="logo">
          <FileText className="logo-icon" />
          <span className="brand-name">FACT STRIP</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="nav-container">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;