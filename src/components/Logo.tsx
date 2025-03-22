// components/Logo.tsx
import React from 'react';
import styled from 'styled-components';
import logoImage from '../assets/logo.png'; // Adjust path if logo is in a different folder

const LogoWrapper = styled.div`
  display: inline-block;
  padding: 0;
  background: transparent;
  border: none;
  text-align: center;
`;

const LogoImg = styled.img`
  width: 40px; // Adjust size as per design
  height: auto;
`;

const Logo: React.FC = () => {
  return (
    <LogoWrapper>
      <LogoImg src={logoImage} alt="HRMail Finder Logo" />
    </LogoWrapper>
  );
};

export default Logo;