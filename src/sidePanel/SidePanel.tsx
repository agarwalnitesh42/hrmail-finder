import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import PopupContent from '../popupContent/PopupContent';
import { SidePanelProps, EmailResponse } from '../types';
import { debounce, getComposeUrl } from '../utils/helpers';
import { ErrorResponse } from '../components/ErrorComponent';
import { FaEnvelope, FaCreditCard } from 'react-icons/fa';
import SubscriptionContent from '../components/SubscriptionContent';
import { useSubscription } from '../hooks/useSubscription';

// SidePanel Styles
const PanelWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #4d5969;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  background: ${({ active }) => (active ? '#181818' : '#f1f1f1')};
  color: ${({ active }) => (active ? '#ffffff' : '#4d5969')};
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? '#2a2a2a' : '#e0e0e0')};
  }
`;

const ContentWrapper = styled.div`
  height: calc(100% - 60px); /* Adjust for tab height and padding */
  overflow-y: auto;
  padding: 10px;
`;

const JOB_TITLE_SELECTOR = '.job-details-jobs-unified-top-card__job-title';
const API_ENDPOINT = 'https://zonamap-report-server.onrender.com/process-application';

const SidePanel = ({ isOpen = false, onClose }: SidePanelProps) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null); // Initialize as null
  const [coverLetter] = useState<string>(``);
  const [userEmail] = useState<string>('agarwalnitesh42@gmail.com');
  const [resumeUrl] = useState<string>('bit.ly/resume123');
  const [activeTab, setActiveTab] = useState<'emails' | 'subscription'>('emails');

  const { plan, error: subscriptionError, loading: subscriptionLoading, isTrialExpired, formatDate, handleSubscribe } = useSubscription({
    freeTrialDays: 7,
    onSuccessfulSubscription: () => setActiveTab('emails'), // Switch to emails tab after successful subscription
  });

  // Log when the side panel opens or closes
  useEffect(() => {
    console.log(`SidePanel isOpen: ${isOpen}`);
  }, [isOpen]);

  // Check if the free trial has expired and switch to subscription tab
  useEffect(() => {
    if (plan && isTrialExpired(plan)) {
      console.log('Free trial expired, switching to subscription tab');
      setActiveTab('subscription');
    }
  }, [plan, isTrialExpired]);

  const getStorageKey = (): string => {
    const jobUrl = window.location.href;
    return `emails_${jobUrl}`;
  };

  const fetchEmailsFromAPI = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null); // Reset error state

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

        const data = await response.json();
        console.log('API response:', data);

        if (!data.success) {
          setError(data);
          setEmails([]);
        } else {
          const email = data.validEmails[0].email;
          const fetchedEmails = [email];
          setEmails(fetchedEmails);

          const storageKey = getStorageKey();
          chrome.storage.local.set({ [storageKey]: fetchedEmails }, () => {
            console.log('Emails stored in chrome.storage.local:', fetchedEmails);
          });
        }
      } catch (err) {
        console.error('Error fetching emails:', err);
        setError({ message: (err as Error).message} as ErrorResponse);
        setEmails([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [coverLetter, userEmail, resumeUrl]
  );

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

  const handleRetry = () => {
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
      setLoading(false);
      setError(null);
    }
  }, [isOpen, loadEmails]);

  const getJobTitle = (): string => {
    const jobTitleElement = document.querySelector(JOB_TITLE_SELECTOR) as HTMLElement;
    if (jobTitleElement) {
      const jobTitle = jobTitleElement.innerText.trim();
      console.log('Fetched job title:', jobTitle);
      return jobTitle;
    }
    console.warn('Job title not found in DOM, using fallback subject');
    return 'Software Engineer';
  };

  const getCompanyNameFromEmail = (email: string): string => {
    try {
      const domain = email.split('@')[1];
      if (!domain) {
        throw new Error('Invalid email format');
      }
      const companyName = domain.split('.')[0];
      return companyName.charAt(0).toUpperCase() + companyName.slice(1);
    } catch (err) {
      console.warn('Failed to extract company name from email:', err);
      return 'Unknown Company';
    }
  };

  const companyName = emails.length > 0 ? getCompanyNameFromEmail(emails[0]) : 'Unknown Company';

  const handleSubmit = (recipientEmails: string[], coverLetter: string, resumeUrl: string) => {
    const jobTitle = getJobTitle();
    const subject = `Application for ${jobTitle}`;

    const body = `${coverLetter}`;

    const composeUrl = getComposeUrl(userEmail, recipientEmails, subject, body);

    window.open(composeUrl, '_blank');
    onClose?.();
  };

  return (
    <PanelWrapper className="side-panel" isOpen={isOpen}>
      <CloseButton onClick={onClose}>✕</CloseButton>
      <TabContainer>
        <Tab active={activeTab === 'emails'} onClick={() => setActiveTab('emails')}>
          {/* <FaEnvelope size={14} /> */}
          Emails
        </Tab>
        <Tab active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')}>
          {/* <FaCreditCard size={14} /> */}
          Subscription
        </Tab>
      </TabContainer>
      <ContentWrapper>
        {activeTab === 'emails' ? (
          <PopupContent
            emails={emails}
            loading={loading}
            coverLetter={coverLetter}
            resumeUrl={resumeUrl}
            onSubmit={handleSubmit}
            onClose={onClose ? onClose : () => {}}
            companyName={companyName}
            onRetry={error ? handleRetry : undefined}
            errorResponse={error}
          />
        ) : (
          <SubscriptionContent
            plan={plan}
            error={subscriptionError}
            loading={subscriptionLoading}
            isTrialExpired={isTrialExpired}
            formatDate={formatDate}
            handleSubscribe={handleSubscribe}
            isSidePanel={true}
          />
        )}
      </ContentWrapper>
    </PanelWrapper>
  );
};

export default SidePanel;