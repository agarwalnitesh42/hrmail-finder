// src/sidePanel/SidePanel.tsx
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import PopupContent from '../popupContent/PopupContent';
import { SidePanelProps, EmailResponse } from '../types';
import { debounce, getComposeUrl } from '../utils/helpers';

const PanelWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: ${({ isOpen }) => (isOpen ? '350px' : '0')};
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  padding: ${({ isOpen }) => (isOpen ? '10px' : '0')};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #ff6200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const JOB_TITLE_SELECTOR = '.job-details-jobs-unified-top-card__job-title'; // Selector for job title
const API_ENDPOINT = 'https://your-https-api-endpoint/process-application'; // Replace with your HTTPS API endpoint

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter] = useState<string>(
    ``
  );
  const [userEmail] = useState<string>('agarwalnitesh42@gmail.com');
  const [resumeUrl] = useState<string>('bit.ly/resume123');

  // Function to fetch job title from DOM
  const getJobTitle = (): string => {
    const jobTitleElement = document.querySelector(JOB_TITLE_SELECTOR) as HTMLElement;
    if (jobTitleElement) {
      const jobTitle = jobTitleElement.innerText.trim();
      console.log('Fetched job title:', jobTitle);
      return jobTitle;
    }
    console.warn('Job title not found in DOM, using fallback subject');
    return 'Software Engineer'; // Fallback job title
  };

  // Function to extract company name from email domain
  const getCompanyNameFromEmail = (email: string): string => {
    try {
      const domain = email.split('@')[1]; // Extract domain (e.g., "okta.com")
      if (!domain) {
        throw new Error('Invalid email format');
      }
      const companyName = domain.split('.')[0]; // Extract company name (e.g., "okta")
      // Capitalize the first letter and return
      return companyName.charAt(0).toUpperCase() + companyName.slice(1); // e.g., "Okta"
    } catch (err) {
      console.warn('Failed to extract company name from email:', err);
      return 'Unknown Company'; // Fallback company name
    }
  };

  // Get company name from the first email
  const companyName = emails.length > 0 ? getCompanyNameFromEmail(emails[0]) : 'Unknown Company';

  // Function to generate a unique storage key based on job URL
  const getStorageKey = (): string => {
    const jobUrl = window.location.href;
    return `emails_${jobUrl}`; // e.g., "emails_https://www.linkedin.com/jobs/view/1234567890"
  };

  // Function to fetch emails from API
  const fetchEmailsFromAPI = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);

      try {
        const jobUrl = window.location.href;
        console.log('Fetching emails for job URL:', jobUrl);

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobUrl,
            coverLetter,
            resume: resumeUrl,
            userEmail,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data: EmailResponse = await response.json();
        console.log('API response:', data);

        if (data.error) {
          setError(data.error);
          setEmails([]);
        } else {
          const fetchedEmails = data.emails || [];
          setEmails(fetchedEmails);

          // Store emails in chrome.storage.local
          const storageKey = getStorageKey();
          chrome.storage.local.set({ [storageKey]: fetchedEmails }, () => {
            console.log('Emails stored in chrome.storage.local:', fetchedEmails);
          });
        }
      } catch (err) {
        console.error('Error fetching emails:', err);
        setError('Failed to fetch emails. Please try again.');
        setEmails([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [coverLetter, userEmail, resumeUrl]
  );

  // Function to check cache and fetch emails if not cached
  const loadEmails = useCallback(() => {
    const storageKey = getStorageKey();
    chrome.storage.local.get([storageKey], (result) => {
      const cachedEmails = result[storageKey];
      if (cachedEmails && cachedEmails.length > 0) {
        console.log('Emails found in cache:', cachedEmails);
        setEmails(cachedEmails);
        setError(null);
        setLoading(false);
      } else {
        console.log('No emails in cache, fetching from API');
        fetchEmailsFromAPI();
      }
    });
  }, [fetchEmailsFromAPI]);

  // Handle retry on error
  const handleRetry = () => {
    // Clear cache for this job URL and fetch again
    const storageKey = getStorageKey();
    chrome.storage.local.remove([storageKey], () => {
      console.log('Cache cleared for job URL:', window.location.href);
      fetchEmailsFromAPI();
    });
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
    } else {
      // Reset state when side panel closes (optional, depending on your preference)
      setLoading(false);
      setError(null);
    }
  }, [isOpen, loadEmails]);

  const handleSubmit = (recipientEmails: string[], coverLetter: string, resumeUrl: string) => {
    const jobTitle = getJobTitle();
    const subject = `Application for ${jobTitle}`;

    const body = `${coverLetter}`;

    const composeUrl = getComposeUrl(userEmail, recipientEmails, subject, body);

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
        companyName={companyName}
        onRetry={error ? handleRetry : undefined} // Pass retry handler only if there's an error
      />
    </PanelWrapper>
  );
};

export default SidePanel;