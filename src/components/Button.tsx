import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  half?: boolean;
  backgroundColor?: string;
}

const StyledButton = styled.button<{ half?: boolean; backgroundColor?: string }>`
  background: ${({ backgroundColor }) => backgroundColor || '#F57451'}; /* Updated default button color */
  color: #ffffff; /* Updated text inside button */
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s ease, transform 0.1s ease;
  width: ${({ half }) => (half ? '48%' : '100%')};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ backgroundColor }) => (backgroundColor ? darkenColor(backgroundColor, -10) : '#2a2a2a')}; /* Slightly lighter shade for hover */
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * Math.abs(percent));
  const R = (num >> 16) + (percent < 0 ? -amt : amt);
  const G = ((num >> 8) & 0x00ff) + (percent < 0 ? -amt : amt);
  const B = (num & 0x0000ff) + (percent < 0 ? -amt : amt);
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const Button: React.FC<ButtonProps> = ({ onClick, children, disabled, half, backgroundColor }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} half={half} backgroundColor={backgroundColor}>
      {children}
    </StyledButton>
  );
};

export default Button;