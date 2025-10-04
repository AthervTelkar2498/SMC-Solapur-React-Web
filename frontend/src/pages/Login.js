import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        onLogin(response.data.token, response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'मराठी' : 'English');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="login-header">
        <h1 className="system-title">Solupur Municipal Corporation – Work Management System</h1>
        <div className="language-toggle">
          <span onClick={toggleLanguage} style={{ cursor: 'pointer' }}>
            English / मराठी
          </span>
          <div className="toggle-switch" onClick={toggleLanguage}>
            <div className={`toggle-circle ${language === 'मराठी' ? 'active' : ''}`}></div>
          </div>
        </div>
      </div>

      <div className="login-card">
        <div className="logo-container">
          <div className="logo">
            <span className="logo-text">SM</span>
          </div>
        </div>

        <h2 className="login-title">Admin Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#A0AEC0"/>
                <path d="M10 12.5C5.58172 12.5 2 14.8431 2 17.7273V20H18V17.7273C18 14.8431 14.4183 12.5 10 12.5Z" fill="#A0AEC0"/>
              </svg>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="login-input"
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8H14V6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8Z" fill="#A0AEC0"/>
              </svg>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
            />
            <div className="password-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8H14V6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6V8H5C3.89543 8 3 8.89543 3 10V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V10C17 8.89543 16.1046 8 15 8Z" fill="#A0AEC0"/>
              </svg>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <a href="#forgot" className="forgot-password">Forgot Password?</a>
        </form>

        <div className="demo-credentials">
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
            <strong>Demo Credentials:</strong><br/>
            Username: admin<br/>
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
