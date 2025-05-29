
import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <h1>About Our Dental Diagnostic App</h1>
      <p>
        Welcome to our AI-powered dental diagnostics platform. We help dentists
        make faster, more accurate assessments using advanced deep learning
        algorithms on dental X-rays.
      </p>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          To improve dental care quality by empowering professionals with
          real-time, AI-assisted radiographic interpretation tools.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Technology</h2>
        <p>
          We use state-of-the-art models and image analysis via Roboflow and
          GPT to detect conditions and generate structured clinical reports.
        </p>
      </div>

      <div className="about-section">
        <h2>Meet the Team</h2>
        <p>
          Our team consists of developers, dental professionals, and AI
          researchers dedicated to transforming oral healthcare.
        </p>
      </div>
    </div>
  );
}

export default About;
