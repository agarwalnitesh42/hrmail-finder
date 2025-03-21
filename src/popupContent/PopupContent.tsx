// PopupContent.tsx (final updated version)
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import EmailList from '../components/EmailList';
import Button from '../components/Button';
import ResumeLink from '../components/ResumeLink';
import EmailProgressBar from '../components/EmailProgressBar';
import CompanyDetails from '../components/CompanyDetails';
import Logo from '../components/Logo'; // Import new Logo component
import { PopupContentProps } from '../types';

// Styled components (unchanged)
const PopupWrapper = styled.div`
  width: 100%;
  // padding: 15px;
  background: white;
  border-radius: 8px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  height: 56%;
`;

const CoverLetterInput = styled.textarea`
  width: 100%;
  height: 100%;
  min-height: 150px;
  // max-height: 420px;
  margin: 10px 0;
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
  color: #333;
`;

const Link = styled.a`
  display: block;
  margin: 10px 0;
  color: #0073b1;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 10px;
  font-size: 14px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  height: 31px;
  font-size: 14px;
  margin-bottom: 10px;
`;

const TextUnderline = styled.text`
  color: black;
  font-size: 14px;
   font-weight: 600;
`;

const PopupContent: React.FC<PopupContentProps> = ({
  emails: initialEmails,
  loading,
  error,
  coverLetter: initialCoverLetter,
  resumeUrl,
  onSubmit,
  onClose,
  companyName = 'Beem',
  companyLogo,
}) => {
  const [emails, setEmails] = useState<string[]>(initialEmails);
  const [coverLetter, setCoverLetter] = useState(initialCoverLetter);

  // Load cover letter from Chrome storage on mount
  useEffect(() => {
    chrome.storage?.local.get(['coverLetter'], (result) => {
      if (result.coverLetter) {
        setCoverLetter(result.coverLetter);
      }
    });
  }, []);

  // Update Chrome storage whenever coverLetter changes
  useEffect(() => {
    chrome.storage?.local.set({ coverLetter }, () => {
      console.log('Cover letter saved to Chrome storage:', coverLetter);
    });
  }, [coverLetter]);

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

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <PopupWrapper>
      <Header>
        <Logo /> {/* Replace Header with Logo */}
        {companyName && <CompanyDetails companyName={companyName} companyLogo={companyLogo} />}
      </Header>
      {loading ? (
        <EmailProgressBar />
      ) : (
        <>
          <TextUnderline> Emails </TextUnderline>
          <EmailList emails={emails} onRemove={handleRemoveEmail} />
          <TextUnderline> Cover Letter </TextUnderline>
          <CoverLetterInput
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Enter your cover letter..."
          />
          <ResumeLink>
            <Link href={resumeUrl} target="_blank">
              Nitesh Agarwal's Resume
            </Link>
          </ResumeLink>
          <ButtonContainer>
            <Button half={true} onClick={onClose}>Cancel</Button>
            <Button half={true} onClick={handleSubmit} disabled={emails.length === 0}>
              Apply
            </Button>
          </ButtonContainer>
        </>
      )}
    </PopupWrapper>
  );
};

export default PopupContent;