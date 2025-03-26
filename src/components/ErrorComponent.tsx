import React from 'react';
import styled from 'styled-components';

export interface Suggestion {
  domain: string;
  likelyEmails: string[];
  alternativeContact: {
    linkedin: string;
    website: string;
    profiles: Array<{
      name: string;
      title: string;
      linkedinUrl: string;
    }>;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  suggestions?: Suggestion; // Make suggestions optional
  code?: string; // Add code as an optional field
}

interface ErrorComponentProps {
  response: ErrorResponse;
  onRetry?: () => void;
}

const ErrorWrapper = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #4d5969;
`;

const ErrorMessage = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const SuggestionsSection = styled.div`
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #4d5969;
  margin-bottom: 10px;
  text-align: left;
`;

const EmailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmailCard = styled.div`
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #4d5969;
  text-align: left;
`;

const ProfileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProfileCard = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: left;
`;

const ProfileName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #4d5969;
`;

const ProfileTitle = styled.div`
  font-size: 12px;
  color: #4d5969;
  margin: 5px 0;
`;

const ProfileLink = styled.a`
  font-size: 12px;
  color: #181818;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LinksSection = styled.div`
  margin-top: 20px;
`;

const LinkItem = styled.a`
  display: block;
  font-size: 14px;
  color: #181818;
  text-decoration: none;
  margin: 5px 0;
  &:hover {
    text-decoration: underline;
  }
`;

const RetryButton = styled.button`
  background: #181818;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    background: #2a2a2a;
  }
`;

const ErrorComponent: React.FC<ErrorComponentProps> = ({ response, onRetry }) => {
  const { message, suggestions } = response;

  // Defensive checks for suggestions and its nested properties
  const domain = suggestions?.domain || '';
  const likelyEmails = suggestions?.likelyEmails || [];
  const alternativeContact = suggestions?.alternativeContact || { linkedin: '', website: '', profiles: [] };
  const { linkedin, website, profiles } = alternativeContact;

  return (
    <ErrorWrapper>
      <ErrorMessage>{message}</ErrorMessage>

      {/* Suggested Emails */}
      {likelyEmails.length > 0 && (
        <SuggestionsSection>
          <SectionTitle>Suggested Emails for {domain}</SectionTitle>
          <EmailList>
            {likelyEmails.map((email, index) => (
              <EmailCard key={index}>{email}</EmailCard>
            ))}
          </EmailList>
        </SuggestionsSection>
      )}

      {/* Alternative Contacts (Profiles) */}
      {profiles.length > 0 && (
        <SuggestionsSection>
          <SectionTitle>Alternative Contacts</SectionTitle>
          <ProfileList>
            {profiles.map((profile, index) => (
              <ProfileCard key={index}>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileTitle>{profile.title}</ProfileTitle>
                <ProfileLink href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  View LinkedIn Profile
                </ProfileLink>
              </ProfileCard>
            ))}
          </ProfileList>
        </SuggestionsSection>
      )}

      {/* Company Links */}
      {(linkedin || website) && (
        <LinksSection>
          <SectionTitle>Company Links</SectionTitle>
          {linkedin && (
            <LinkItem href={linkedin} target="_blank" rel="noopener noreferrer">
              Visit LinkedIn Page
            </LinkItem>
          )}
          {website && (
            <LinkItem href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </LinkItem>
          )}
        </LinksSection>
      )}

      {/* Retry Button */}
      {onRetry && <RetryButton onClick={onRetry}>Retry</RetryButton>}
    </ErrorWrapper>
  );
};

export default ErrorComponent;