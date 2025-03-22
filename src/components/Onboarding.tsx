// src/components/Onboarding.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); // Darker overlay for better contrast
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 350px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); // Slightly darker shadow
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 10px;
`;

const WelcomeText = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #ff6200;
  margin: 0;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #333; // Darker text for better readability
  margin: 5px 0 0;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333; // Darker label color
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: #fff; // Ensure input background is white
  color: #333; // Ensure input text is dark

  &:focus {
    border-color: #ff6200;
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: #fff; // Ensure select background is white
  color: #333; // Ensure select text is dark

  &:focus {
    border-color: #ff6200;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #ff6200 0%, #ff8c00 100%);
  border: none;
  border-radius: 25px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #e65a00 0%, #ff6200 100%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`;

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save email and country to chrome.storage
    chrome.storage.local.set({ email, country }, () => {
      console.log('Onboarding data saved:', { email, country });
      onComplete(); // Call onComplete to mark onboarding as done
    });
  };

  return (
    <OnboardingOverlay>
      <OnboardingContainer>
        <Header>
          <LogoWrapper>
            <Logo />
          </LogoWrapper>
          <WelcomeText>Welcome to HRMail Finder</WelcomeText>
          <SubText>Let's get started with some basic info</SubText>
        </Header>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label>Country</Label>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>Select your country</option>
              <option value="US">United States</option>
              <option value="IN">India</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              {/* Add more countries as needed */}
            </Select>
          </InputGroup>
          <SubmitButton type="submit">Continue</SubmitButton>
        </Form>
      </OnboardingContainer>
    </OnboardingOverlay>
  );
};

export default Onboarding;