import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    background-color: #f8fafc;
  }

  input, button, select, textarea {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }
`;

export const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><style>.cls-1{fill:none;stroke:%23ffffff;stroke-width:0.5;opacity:0.1;}</style></defs><g><polygon class="cls-1" points="100,100 200,50 300,100 200,150"/><polygon class="cls-1" points="300,100 400,50 500,100 400,150"/><polygon class="cls-1" points="500,100 600,50 700,100 600,150"/><polygon class="cls-1" points="700,100 800,50 900,100 800,150"/><polygon class="cls-1" points="100,300 200,250 300,300 200,350"/><polygon class="cls-1" points="300,300 400,250 500,300 400,350"/><polygon class="cls-1" points="500,300 600,250 700,300 600,350"/><polygon class="cls-1" points="700,300 800,250 900,300 800,350"/><polygon class="cls-1" points="100,500 200,450 300,500 200,550"/><polygon class="cls-1" points="300,500 400,450 500,500 400,550"/><polygon class="cls-1" points="500,500 600,450 700,500 600,550"/><polygon class="cls-1" points="700,500 800,450 900,500 800,550"/></g></svg>');
    z-index: 0;
  }
`;

export const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 60px 50px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 1;
`;

export const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
`;

export const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LanguageToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

export const ToggleSwitch = styled.div`
  width: 50px;
  height: 25px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 19px;
    height: 19px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    transform: ${props => props.active ? 'translateX(24px)' : 'translateX(0)'};
  }
`;

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

export const LogoCircle = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    z-index: -1;
    opacity: 0.3;
  }
`;

export const LoginTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin-bottom: 40px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const InputGroup = styled.div`
  position: relative;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 1;
`;

export const Input = styled.input`
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: #f8fafc;
  transition: all 0.3s ease;
  outline: none;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #cbd5e1;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ForgotPassword = styled.a`
  text-align: center;
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin-top: 20px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
`;