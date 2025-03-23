// components/CompanyDetails.tsx
import React from 'react';
import styled from 'styled-components';

const CompanyDetailsWrapper = styled.div`
  display: flex;
  margin-right: 24px;
  border-radius: 4px;
`;

const CompanyLogo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  object-fit: cover;
`;

const CompanyName = styled.h4`
  margin: 0;
  font-size: 14px;
  color: #333;
`;

interface CompanyDetailsProps {
  companyName: string;
  companyLogo?: string;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ companyName, companyLogo }) => {
  return (
    <CompanyDetailsWrapper>
      {/* <CompanyLogo
        src={companyLogo || 'https://media.licdn.com/dms/image/v2/D560BAQGLWDA76nuPeQ/company-logo_200_200/company-logo_200_200/0/1729984506574/trybeemapp_logo?e=1749686400&v=beta&t=r6EwtOGtUbsA4kA7nVmjJsa7PU9CoM7BtP7SJJAbXIE'} // Placeholder logo
        alt={`${companyName} Logo`}
      /> */}
      <CompanyName>{companyName}</CompanyName>
    </CompanyDetailsWrapper>
  );
};

export default CompanyDetails;