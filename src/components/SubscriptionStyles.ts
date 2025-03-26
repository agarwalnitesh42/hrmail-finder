import styled from 'styled-components';

export const SubscriptionWrapper = styled.div<{ isSidePanel?: boolean }>`
  background: #ffffff;
  padding: ${({ isSidePanel }) => (isSidePanel ? '10px' : '20px')};
  border-radius: 8px;
  text-align: ${({ isSidePanel }) => (isSidePanel ? 'left' : 'center')};
  color: #4d5969;
  font-family: 'Arial', sans-serif;
  height: ${({ isSidePanel }) => (isSidePanel ? '100%' : 'auto')};
  overflow-y: ${({ isSidePanel }) => (isSidePanel ? 'auto' : 'visible')};
`;

export const PlanTitle = styled.h2<{ isSidePanel?: boolean }>`
  font-size: ${({ isSidePanel }) => (isSidePanel ? '20px' : '24px')};
  font-weight: 600;
  margin-bottom: 10px;
  color: #181818;
`;

export const PlanDescription = styled.p<{ isSidePanel?: boolean }>`
  font-size: ${({ isSidePanel }) => (isSidePanel ? '14px' : '16px')};
  margin-bottom: ${({ isSidePanel }) => (isSidePanel ? '15px' : '20px')};
  color: #4d5969;
`;

export const CostTable = styled.table<{ isSidePanel?: boolean }>`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${({ isSidePanel }) => (isSidePanel ? '15px' : '20px')};
  background: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
`;

export const TableHeader = styled.th<{ isSidePanel?: boolean }>`
  padding: ${({ isSidePanel }) => (isSidePanel ? '8px' : '10px')};
  background: #181818;
  color: #ffffff;
  font-weight: 600;
  font-size: ${({ isSidePanel }) => (isSidePanel ? '12px' : '14px')};
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f1f1f1;
  }
`;

export const TableCell = styled.td<{ isSidePanel?: boolean }>`
  padding: ${({ isSidePanel }) => (isSidePanel ? '8px' : '10px')};
  font-size: ${({ isSidePanel }) => (isSidePanel ? '12px' : '14px')};
  color: #4d5969;
`;

export const SubscribeButton = styled.button<{ isSidePanel?: boolean }>`
  background: #181818;
  color: #ffffff;
  border: none;
  padding: ${({ isSidePanel }) => (isSidePanel ? '8px 16px' : '10px 20px')};
  border-radius: 8px;
  cursor: pointer;
  font-size: ${({ isSidePanel }) => (isSidePanel ? '14px' : '16px')};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ isSidePanel }) => (isSidePanel ? '8px' : '10px')};
  margin: 0 auto;
  transition: background 0.2s ease;

  &:hover {
    background: #2a2a2a;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

export const CurrentPlan = styled.div<{ isSidePanel?: boolean }>`
  background: #e8f5e9;
  padding: ${({ isSidePanel }) => (isSidePanel ? '10px' : '15px')};
  border-radius: 8px;
  margin-bottom: ${({ isSidePanel }) => (isSidePanel ? '15px' : '20px')};
  display: flex;
  align-items: center;
  gap: ${({ isSidePanel }) => (isSidePanel ? '8px' : '10px')};
  color: #2e7d32;
  font-size: ${({ isSidePanel }) => (isSidePanel ? '14px' : '16px')};
`;

export const ErrorMessage = styled.div<{ isSidePanel?: boolean }>`
  color: #d32f2f;
  font-size: ${({ isSidePanel }) => (isSidePanel ? '12px' : '14px')};
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const LoadingMessage = styled.div<{ isSidePanel?: boolean }>`
  color: #4d5969;
  font-size: ${({ isSidePanel }) => (isSidePanel ? '12px' : '14px')};
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
`;