import React from 'react';
import styled from 'styled-components';

interface EmailListProps {
  emails: string[];
  onRemove: (email: string) => void;
}

const EmailContainer = styled.div`
  margin: 5px 0;
  max-height: 100px;
  overflow-y: auto;
`;

const EmailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 14px;
  width: 100%;
`;

const RemoveButton = styled.span`
  color: red;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
`;

const Note = styled.p`
  font-size: 12px;
  color: #666;
  margin: 5px 0;
`;

const EmailItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: #f5f5f5;
  align-items: center;
  padding: 5px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 5px;
  font-size: 14px;
  width: 100%;
`;

const Status = styled.span`
  padding: 5px;
  background: #7ef17e;
  font-size: 10px;
  border-radius: 6px;
`;


const EmailList: React.FC<EmailListProps> = ({ emails, onRemove }) => {
  if (!emails.length) {
    return <Note>No emails found.</Note>;
  }

  return (
    <>
      <EmailContainer>
        {emails.map((email) => (
          <EmailItemContainer>
            <Status> verified </Status>
            <EmailItem key={email}>
              <span>{email}</span>
              <RemoveButton onClick={() => onRemove(email)}>X</RemoveButton>
            </EmailItem>
          </EmailItemContainer>
        ))}
      </EmailContainer>
      <Note>
        Above box might have multiple email IDs, we suggest not to remove any of them to reach
        better conversion.
      </Note>
    </>
  );
};

export default EmailList;