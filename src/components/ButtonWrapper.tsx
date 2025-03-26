import React, { useEffect } from 'react';
import styled from 'styled-components';
import Logo from './Logo';

interface ButtonWrapperProps {
  onClick: () => void;
  disabled?: boolean;
}

const ButtonContainer = styled.div`
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
  margin-left: 10px;
  background: #F44336 !important; /* Updated button color */
  color: #ffffff !important; /* Updated text inside button */
  border: none !important;
  padding: 10px 10px !important;
  border-radius: 22px !important;
  cursor: pointer !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  transition: background 0.2s ease, transform 0.1s ease !important;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    background: #2a2a2a !important; /* Slightly lighter shade for hover */
    transform: translateY(-1px) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  &:disabled {
    background: #cccccc !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
  }
`;

const ButtonWrapper = ({ onClick, disabled }: any) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
      const openEvent = new CustomEvent('sidePanelToggle', { detail: { isOpen: true } });
      window.dispatchEvent(openEvent);
    }
  };

  return (
    <ButtonContainer>
      <StyledButton onClick={handleClick}>
        Reveal Email & Apply <Logo width={`70px`}/>
      </StyledButton>
    </ButtonContainer>
  );
};

export default ButtonWrapper;