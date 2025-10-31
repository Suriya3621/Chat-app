import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css';

function Error() {
  return (
    <div className="error-container">
      <div className="error-content">
        {/* 404 Number with floating animation */}
        <div className="error-number">404</div>

        {/* Error Message with Typing Animation */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="typing-animation">
            Oops... your URL is wrong
          </div>
        </div>

        {/* Buttons */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/">
            <button className="btn-primary">
              Click here to go to login page
            </button>
          </Link>
          
          <a href="https://suriyaprakash2009.netlify.app">
            <button className="btn-secondary">
              Click here to visit Admin details
            </button>
          </a>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default Error;