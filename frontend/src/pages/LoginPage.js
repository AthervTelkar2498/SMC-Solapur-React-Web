import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  LoginContainer,
  LoginCard,
  Header,
  Title,
  LanguageToggle,
  ToggleSwitch,
  Logo,
  LogoCircle,
  LoginTitle,
  Form,
  InputGroup,
  InputIcon,
  Input,
  LoginButton,
  ForgotPassword,
  ErrorMessage
} from '../styles/LoginStyles';

const LoginPage = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [language, setLanguage] = useState('english');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'marathi' : 'english');
  };

  if (loading) {
    return (
      <LoginContainer>
        <LoginCard>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '18px', color: '#64748b' }}>Loading...</div>
          </div>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
    <LoginContainer>
      <Header>
        <Title>Solupur Municipal Corporation – Work Management System</Title>
        <LanguageToggle>
          <span>English / मराठी</span>
          <ToggleSwitch active={language === 'marathi'} onClick={toggleLanguage} />
        </LanguageToggle>
      </Header>

      <LoginCard>
        <Logo>
          <LogoCircle>SM</LogoCircle>
          <LoginTitle>Admin Login</LoginTitle>
        </Logo>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <Lock size={20} />
            </InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </InputGroup>

          <LoginButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </LoginButton>
        </Form>

        <ForgotPassword href="#forgot">
          Forgot Password?
        </ForgotPassword>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;