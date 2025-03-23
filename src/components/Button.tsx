// components/Button.tsx
import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  half?: boolean; // Prop to make button width 50%
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
}
// color:#333333 white; // White text
const StyledButton = styled.button<{ disabled?: boolean; half?: boolean; backgroundColor?: string; }>`
  background: ${(props) => (props.backgroundColor === 'white') ? 'white': '#ff6200'}; // Orange background as per screenshot
  color: ${(props) => (props.backgroundColor === 'white') ? '#333333': '#ffffff'}; 
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
    background: ${({ backgroundColor }) => (backgroundColor ? darkenColor(backgroundColor, 10) : '#e55a00')};
    opacity: ${(props) => (props.disabled ? 0.6 : 0.9)}; // Slight opacity change on hover
  }

  &:focus {
    outline: none; // Remove default focus outline
    box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.3); // Custom focus ring
  }
`;

// Utility function to darken a color (for hover effect)
const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children, half, backgroundColor }) => {
  return (
    <StyledButton half={half} onClick={onClick} disabled={disabled} backgroundColor={'white'}>
      {children}
    </StyledButton>
  );
};

export default Button;