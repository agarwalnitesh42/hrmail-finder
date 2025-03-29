import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import EmailList from '../components/EmailList';
import Button from '../components/Button';
import ResumeLink from '../components/ResumeLink';
import EmailProgressBar from '../components/EmailProgressBar';
import CompanyDetails from '../components/CompanyDetails';
import Logo from '../components/Logo';
import { PopupContentProps } from '../types';
import ErrorComponent from '../components/ErrorComponent';

// Styled components with updated color palette
const PopupWrapper = styled.div`
  width: 100%;
  background: #ffffff; /* Updated background color */
  border-radius: 8px;
  font-family: Arial, sans-serif;
  height: 58%;
`;

const CoverLetterInput = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 150px;
  margin: 4px 0;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  white-space: pre-wrap;
  overflow-y: auto;
  background-color: #fff;
  color: #4d5969; /* Updated text color */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  height: 31px;
  font-size: 14px;
  border-bottom: 1px solid #d5d5d5;
`;

const TextUnderline = styled.text`
  color: #4d5969; /* Updated text color */
  font-size: 14px;
  font-weight: 600;
`;


const PopupContent: React.FC<PopupContentProps> = ({
  emails: initialEmails,
  loading,
  coverLetter: initialCoverLetter,
  resumeUrl,
  onSubmit,
  onClose,
  companyName = 'Beem',
  companyLogo,
  onRetry,
  errorResponse
}) => {
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [coverLetter, setCoverLetter] = useState(initialCoverLetter);

  useEffect(() => {
    chrome.storage?.local.get(['coverLetter'], (result) => {
      if (result.coverLetter) {
        setCoverLetter(result.coverLetter);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage?.local.set({ coverLetter }, () => {
      console.log('Cover letter saved to Chrome storage:', coverLetter);
    });
  }, [coverLetter]);

  useEffect(() => {
    setEmails(initialEmails);
  }, [initialEmails]);

  const handleRemoveEmail = useCallback((email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  }, []);

  const handleSubmit = useCallback(() => {
    if (emails.length === 0) {
      alert('Please add at least one email to proceed.');
      return;
    }
    onSubmit(emails, coverLetter, resumeUrl);
  }, [emails, coverLetter, resumeUrl, onSubmit]);

  return (
    <PopupWrapper>
      <Header>
        <Logo />
        {companyName && <CompanyDetails companyName={companyName} companyLogo={companyLogo} />}
      </Header>
      {loading ? (
        <EmailProgressBar />
      ) : errorResponse ? (
        <ErrorComponent response={errorResponse} onRetry={onRetry} />
      ): (
        <>
          <TextUnderline>Emails</TextUnderline>
          <EmailList emails={emails} onRemove={handleRemoveEmail} />
          <TextUnderline>Cover Letter</TextUnderline>
          <CoverLetterInput
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Enter your cover letter..."
          />
          <ResumeLink>
            <text>Please Add Resume in the next step while sending email</text>
          </ResumeLink>
          <ButtonContainer>
            <Button backgroundColor={'#181818'}  half={true} onClick={onClose}>
              Cancel
            </Button>
            <Button
              /* Updated button color */
              half={true}
              onClick={handleSubmit}
              disabled={emails.length === 0}
            >
              Apply
            </Button>
          </ButtonContainer>
        </>
      )}
    </PopupWrapper>
  );
};

export default PopupContent;