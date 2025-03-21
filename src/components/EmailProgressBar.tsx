// components/EmailProgressBar.tsx
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframes for progress bar animation
const fill = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

// Styled components
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressImage = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 90%;
  background: #ff6200; /* Match the orange color from the screenshot */
  animation: ${fill} 5s linear forwards; /* 5-second animation */
`;

const ProgressText = styled.p`
  font-size: 14px;
  color: #333;
  margin: 10px 0;
  text-align: center;
`;

// Random progress messages
const messages = [
  'Scanning LinkedIn for HR contacts…',
  'Finding emails at Okta…',
  'Almost there, hang tight…',
  'Generating email patterns…',
  'Checking for HR leads…',
];

// Component
const EmailProgressBar: React.FC = () => {
  const [progressText, setProgressText] = useState(messages[0]);

  // Rotate messages every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setProgressText(messages[randomIndex]);
    }, 1500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <ProgressContainer>
      <ProgressImage
        src="https://cdn-icons-png.flaticon.com/512/622/622669.png" // Magnifying glass icon
        alt="Email Search Icon"
      />
      <ProgressBarWrapper>
        <ProgressBar />
      </ProgressBarWrapper>
      <ProgressText>{progressText}</ProgressText>
    </ProgressContainer>
  );
};

export default EmailProgressBar;