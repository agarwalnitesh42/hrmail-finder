// components/Logo.tsx
import React from 'react';
import styled from 'styled-components';

const LogoWrapper = styled.div`
  display: inline-block;
  padding: 5px 10px;
  background: #fff;
  border: 2px solid #ff6200;
  border-radius: 4px;
  text-align: center;
`;

const LogoText = styled.h3`
  margin: 0;
  font-size: 16px;
  font-family: Arial, sans-serif;
`;

const Highlight = styled.span`
  color: #ff6200;
`;

const Logo: React.FC = () => {
  return (
    <LogoWrapper>
      <LogoText>
        <Highlight>HR</Highlight>Mail Finder
      </LogoText>
    </LogoWrapper>
  );
};

export default Logo;