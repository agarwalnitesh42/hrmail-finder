import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  half?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ disabled?: boolean, half?: boolean }>`
  background-color: #ff6200;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  margin-left: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s ease;
  width: ${props => (props.half ? '50%': '100%')};
  &:hover {
    opacity: ${props => (props.disabled ? 0.6 : 0.9)};
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children, half }) => {
  return (
    <StyledButton half={half} onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
};

export default Button;