// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Palette, 
  Users, 
  Code, 
  Heart,
  Mail,
  Globe,
  Shield,
  Eye
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Verification",
      description: "Powered by cutting-edge AI algorithms that cross-reference multiple reliable sources with high accuracy"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Engaging Comics",
      description: "Transform complex facts into easy-to-understand visual narratives that captivate and educate"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Building Awareness",
      description: "Helping combat misinformation through accessible fact-checking tools for everyone"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Analysis",
      description: "Instant processing with mood detection and contextual understanding"
    }
  ];

  const technologies = [
    { name: "React", description: "Modern frontend framework" },
    { name: "Node.js", description: "Backend runtime environment" },
    { name: "AI/ML APIs", description: "Advanced fact-checking algorithms" },
    { name: "Computer Vision", description: "Image analysis and generation" },
    { name: "Natural Language Processing", description: "Text understanding and mood detection" },
    { name: "Python", description: "Data processing and AI models" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="about-hero-content"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-icon"
          >
            <Target className="w-16 h-16" />
          </motion.div>
          <h1>Our Mission</h1>
          <p className="hero-subtitle">
            Fact-Strip was created to combat the spread of misinformation by making 
            fact-checking accessible, engaging, and understandable for everyone. 
            We believe that visual storytelling can bridge the gap between complex 
            information and public understanding.
          </p>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="section-spacing">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>How It Works</h2>
            <p>Our comprehensive approach to fighting misinformation</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="feature-card"
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section-spacing tech-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h2>Technology Stack</h2>
            <p>Built with modern technologies for reliable performance</p>
          </motion.div>

          <div className="tech-grid">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="tech-card"
                whileHover={{ scale: 1.05 }}
              >
                <Code className="w-6 h-6" />
                <div>
                  <h4>{tech.name}</h4>
                  <p>{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-spacing contact-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="contact-content"
          >
            <div className="contact-icon">
              <Mail className="w-12 h-12" />
            </div>
            <h2>Get In Touch</h2>
            <p className="contact-description">
              Have questions or suggestions? We'd love to hear from you! 
              Join us in our mission to create a more informed world.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <Globe className="w-5 h-5" />
                <span>Email us at: contact@factstrip.com</span>
              </div>
              <div className="contact-item">
                <Eye className="w-5 h-5" />
                <span>Follow our GitHub repository</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="about-footer"
      >
        <div className="container">
          <div className="footer-content">
            <Heart className="w-6 h-6" />
            <p>Made with love for a more informed world</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default About;