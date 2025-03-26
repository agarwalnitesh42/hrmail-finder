// components/Logo.tsx
import React from 'react';
import styled from 'styled-components';
import logoImage from '../assets/hmf-logo.png'; // Adjust path if logo is in a different folder

const LogoWrapper = styled.div`
  display: inline-block;
  padding: 0;
  background: #fff;
  border: none;
  text-align: center;
  padding: 0px 5px;
  border-radius: 2px;
`;

const LogoImg = styled.img<{ width?: string }>`
  width: ${props => (props.width ? props.width : '100px')}; // Adjust size as per design
  height: auto;
`;

interface ILogoProps {
  width?: string;
}

const Logo = ({width = '100px'}: ILogoProps) => {
  return (
    <LogoWrapper>
      <LogoImg width={width} src={logoImage} alt="HRMail Finder Logo" />
    </LogoWrapper>
  );
};

export default Logo;