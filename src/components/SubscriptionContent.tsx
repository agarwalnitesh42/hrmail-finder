import React from 'react';
import { FaCheckCircle, FaClock, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';
import {
  SubscriptionWrapper,
  PlanTitle,
  PlanDescription,
  CostTable,
  TableHeader,
  TableRow,
  TableCell,
  SubscribeButton,
  CurrentPlan,
  ErrorMessage,
  LoadingMessage,
} from './SubscriptionStyles';

interface SubscriptionContentProps {
  plan: { type: 'free' | 'paid'; startDate: string; endDate: string; paymentStatus: 'pending' | 'completed' | 'failed' } | null;
  error: string | null;
  loading: boolean;
  isTrialExpired: (plan: { type: 'free' | 'paid'; startDate: string; endDate: string; paymentStatus: 'pending' | 'completed' | 'failed' }) => boolean;
  formatDate: (dateString: string) => string;
  handleSubscribe: () => void;
  isSidePanel?: boolean;
}

const SubscriptionContent: React.FC<SubscriptionContentProps> = ({
  plan,
  error,
  loading,
  isTrialExpired,
  formatDate,
  handleSubscribe,
  isSidePanel = false,
}) => {
  return (
    <SubscriptionWrapper isSidePanel={isSidePanel}>
    
        <>
          {plan && plan.type === 'free' && !isTrialExpired(plan) ? (
            <CurrentPlan isSidePanel={isSidePanel}>
              {/* <FaClock size={isSidePanel ? 16 : 20} /> */}
              <div>
                <strong>Free Trial Active</strong>
                <p style={{color: "black"}}>
                  Ends on {formatDate(plan.endDate)}. Upgrade to continue after the trial.
                </p>
              </div>
            </CurrentPlan>
          ) : plan && plan.type === 'paid' ? (
            <CurrentPlan isSidePanel={isSidePanel}>
              {/* <FaCheckCircle size={isSidePanel ? 16 : 20} /> */}
              <div>
                <strong>Subscribed Plan</strong>
                <p style={{color: "black"}}>
                  Valid until {formatDate(plan.endDate)}.
                </p>
              </div>
            </CurrentPlan>
          ) : null}

          {(!plan || plan.type === 'free' && isTrialExpired(plan)) || !plan.type ? (
            <>
              <PlanTitle isSidePanel={isSidePanel}>Upgrade to Premium</PlanTitle>
              <PlanDescription isSidePanel={isSidePanel}>
                Get access to HR emails for 5 months – perfect for your job change!
              </PlanDescription>

              <CostTable isSidePanel={isSidePanel}>
                <thead>
                  <tr>
                    <TableHeader isSidePanel={isSidePanel}>Months</TableHeader>
                    <TableHeader isSidePanel={isSidePanel}>Cost per Month</TableHeader>
                    <TableHeader isSidePanel={isSidePanel}>Total</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  <TableRow>
                    <TableCell isSidePanel={isSidePanel}>5</TableCell>
                    <TableCell isSidePanel={isSidePanel}>₹80 × 5</TableCell>
                    <TableCell isSidePanel={isSidePanel}>₹399</TableCell>
                  </TableRow>
                </tbody>
              </CostTable>

              <SubscribeButton onClick={handleSubscribe} disabled={loading} isSidePanel={isSidePanel}>
                {/* <FaCreditCard size={isSidePanel ? 14 : 16} /> */}
                {loading ? 'Processing...' : 'Subscribe Now for ₹399'}
              </SubscribeButton>

              {error && (
                <ErrorMessage isSidePanel={isSidePanel}>
                  {/* <FaExclamationTriangle size={isSidePanel ? 14 : 16} /> */}
                  {error}
                </ErrorMessage>
              )}
              {loading && (
                <LoadingMessage isSidePanel={isSidePanel}>
                  {/* <FaClock size={isSidePanel ? 14 : 16} /> */}
                  Processing your payment...
                </LoadingMessage>
              )}
            </>
          ) : null}
        </>

    </SubscriptionWrapper>
  );
};

export default SubscriptionContent;