import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import {
  FileImage,
  FileText,
  User,
  Brain,
  
} from "lucide-react";
import "./home.css";

function Home() {
    
    
  const steps = [
    {
      icon: <FileImage size={24} />,
      title: "Upload Dental Image",
      description: "DICOM formats supported. No patient data required.",
    },
    {
      icon: <Brain size={24} />,
      title: "AI-Powered Analysis",
      description: "Real-time processing. Trained on expert-annotated images.",
    },
    {
      icon: <FileText size={24} />,
      title: "Download Diagnostic Report",
      description: "PDF format. Clinical-grade output.",
    },
  ];

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
            

          <div className="logo-group">
            <div className="logo-circle">
              <Brain size={20} />
            </div>
            <h1 className="app-title">Smilescan AI</h1>
          </div>
          <div className="nav-buttons">
            <Link to="/report-generator" className="nav-btn">Generate Report</Link>
            <Link to="/about" className="nav-btn">About</Link>
            
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem' }}>
  <div style={{ maxWidth: '50%' }}>
    <h2 style={{ fontWeight: 'bold', fontSize: '2rem' }}>Advanced Dental X-Ray Analysis with AI Technology</h2>
    <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#555' }}>
      Transform your dental practice with our cutting-edge AI platform that analyzes x-rays with precision and generates detailed diagnostic reports.
    </p>
  </div>
  <img
    src="slide3.jpg" // Replace with actual image path
    alt="X-ray analysis"
    style={{ width: '45%', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
  />
</div>


      {/* Intro Section */}
      <section className="intro-section">
        <h1 className="main-heading">AI DENTAL DIAGNOSTICS PLATFORM</h1>
        <p className="intro-text">
          Welcome to Smilescan AI — the next generation of dental diagnostics. Our platform delivers real-time, radiologist-level insights using advanced artificial intelligence.
        </p>
        <p className="intro-text">
          Upload your dental radiographs and receive instant diagnostic reports powered by deep learning models trained on thousands of annotated cases.
        </p>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="section-header">
          <div className="section-badge">
            <Brain size={16} />
            <span>Process</span>
          </div>
          <h2 className="section-title">Obtain a Report in 3 Simple Steps</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step, idx) => (
            <StepCard key={idx} {...step} number={idx + 1} />
          ))}
        </div>
        <div className="generate-button-container">
          <Link to="/report-generator" className="generate-btn">⚡ Generate Report</Link>
        </div>
      </section>
      </div>
  );
}

function StepCard({ icon, title, description, number }) {
  return (
    <div className="card step-card">
      <div className="step-number">{number}</div>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
}

export default Home;
