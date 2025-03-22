// src/sidePanel/SidePanel.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PopupContent from '../popupContent/PopupContent';
import { SidePanelProps, EmailResponse } from '../types';
import { debounce, getComposeUrl } from '../utils/helpers';

const PanelWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: ${({ isOpen }) => (isOpen ? '350px' : '0')}; // Fully closed when not open
  height: 100%;
  background-color: #f5f5f5; // Light background for contrast with dark theme
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2); // Slightly darker shadow
  z-index: 1000;
  transition: width 0.3s ease-in-out; // Smooth transition for open/close
  overflow: hidden; // Hide content when closed
  padding: ${({ isOpen }) => (isOpen ? '10px' : '0')}; // Padding only when open
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #ff6200; // Theme color for close button
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  // Mock data for now (replace with API call later)
  const [emails, setEmails] = useState<string[]>([
    'khushi.agarwal@okta.com',
    'poonam.sharma@okta.com',
    'raj.gupta@okta.com',
    'kamal.gupta@okta.com',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter] = useState<string>(
    `Hi Manuel,
Hope you’re doing great. Saw your comment earlier today, I would like to apply for the Frontend Engineer position at Stack AI. Here’s a brief overview of my qualifications:
- Current Role: Platform Engineer at Beem (trybeem.com), an AI-based fintech superapp.
- infra.Market: 2.5 bn$ values e-commerce company based out of India. Founding engineer, built from zero to one, also set up the Frontend Platform team, conducted 10 experiments, took 7 to production.
- Open Source Projects: Developed multiple projects, including the active tiny-locate-db (https://github.com/nitesh2/tiny-locate-db). More projects on my GITHUB (https://github.com/nitesh2).
- Startup Founder: At Zonamap (zonamap.in), worked full stack, managed frontend map visualization, backend, and GIS data sourcing using GOIS. Learned valuable lessons despite shutting down due to business model challenges.
Best regards,
Nitesh Agarwal,
+91-971354430`
  );
  const userEmail = 'user@gmail.com';
  const [resumeUrl] = useState<string>('bit.ly/resume123');

  useEffect(() => {
    // Placeholder for future API call to fetch emails
    const fetchEmails = debounce(() => {
      setLoading(true);
      // Mock API call
      setTimeout(() => {
        const response: EmailResponse = { emails: ['khushi.agarwal@okta.com'] };
        if (response.error) {
          setError(response.error);
        } else {
          setEmails(response.emails || []);
        }
        setLoading(false);
      }, 1000);
    }, 300);

    if (isOpen) {
      fetchEmails();
    }
  }, [isOpen]);

  const handleSubmit = (recipientEmails: string[], coverLetter: string, resumeUrl: string) => {
    const subject = 'Application for Senior Software Engineer';
    const body = `${coverLetter}\n\nPlease attach my resume from: ${resumeUrl}\n(Note: Please manually attach your resume in the email compose window.)`;

    // Get the compose URL based on the user's email provider
    const composeUrl = getComposeUrl(userEmail, recipientEmails, subject, body);

    // Open the compose URL in a new Chrome tab
    window.open(composeUrl, '_blank');
    onClose();
  };

  return (
    <PanelWrapper className="side-panel" isOpen={isOpen}>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <PopupContent
        emails={emails}
        loading={loading}
        error={error}
        coverLetter={coverLetter}
        resumeUrl={resumeUrl}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </PanelWrapper>
  );
};

export default SidePanel;