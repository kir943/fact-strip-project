// src/pages/Home.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Shield, TrendingUp, Users } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "AI-Powered Fact Checking",
      description: "Advanced algorithms verify statements against reliable sources with confidence scoring"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Real-time Analysis",
      description: "Get instant results with detailed breakdowns and source verification"
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Community Driven",
      description: "Share and discuss fact-checks with our growing community"
    }
  ];

  const stats = [
    { value: "10K+", label: "Statements Verified" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "24/7", label: "Real-time Monitoring" },
    { value: "50+", label: "Trusted Sources" }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-content"
        >
          <h1>Fact-Strip: Visual Truth-Teller</h1>
          <p className="hero-subtitle">
            Transform complex information into engaging comic strips with AI-powered fact-checking and mood detection
          </p>
          <Link to="/fact-check" className="cta-button">
            <Search className="w-5 h-5" />
            Start Fact-Checking
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-visual"
        >
          <div className="floating-cards">
            <div className="card true">TRUE</div>
            <div className="card false">FALSE</div>
            <div className="card unverified">UNVERIFIED</div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="stat-card"
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="section-title"
        >
          Why Choose Fact-Strip?
        </motion.h2>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="cta-content"
        >
          <h2>Ready to Discover the Truth?</h2>
          <p>Join thousands of users who trust Fact-Strip for accurate, visual fact-checking</p>
          <Link to="/fact-check" className="cta-button secondary">
            Try It Now - Free
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;