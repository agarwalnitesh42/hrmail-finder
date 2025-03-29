import React from 'react';
import styled from 'styled-components';

interface ResumeLinkProps {
  children?: React.ReactNode;
}

const StyledResume = styled.div<{ disabled?: boolean }>`
  background-color: #f5f5f5;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  border-
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s ease;
  width: 100%;
  margin-bottom: 3%;
  &:hover {
    opacity: ${props => (props.disabled ? 0.6 : 0.9)};
  }
`;

const ResumeLink: React.FC<ResumeLinkProps> = ({ children }) => {
  return (
    <StyledResume>
      {children}
    </StyledResume>
  );
};

export default ResumeLink;