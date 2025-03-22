// components/Button.tsx
import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  half?: boolean; // Prop to make button width 50%
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ disabled?: boolean; half?: boolean }>`
  background: #ff6200; // Orange background as per screenshot
  color: white; // White text
  border: none; // No border
  border-radius: 4px; // Rounded corners
  padding: 10px 20px; // Increased padding for better look
  font-family: Arial, sans-serif; // Clean font
  font-size: 16px; // Slightly larger font size
  font-weight: 600; // Bold text
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}; // Cursor style
  opacity: ${(props) => (props.disabled ? 0.6 : 1)}; // Opacity for disabled state
  transition: background 0.3s ease, opacity 0.2s ease; // Smooth transitions
  width: ${(props) => (props.half ? '50%' : '100%')}; // Half width if half prop is true
  display: inline-flex; // Ensure button content is centered
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => (props.disabled ? '#ff6200' : '#e55a00')}; // Darker orange on hover, no change if disabled
    opacity: ${(props) => (props.disabled ? 0.6 : 0.9)}; // Slight opacity change on hover
  }

  &:focus {
    outline: none; // Remove default focus outline
    box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.3); // Custom focus ring
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