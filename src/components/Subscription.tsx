import React from 'react';
import SubscriptionContent from './SubscriptionContent';
import { useSubscription } from '../hooks/useSubscription';

const Subscription: React.FC = () => {
  const { plan, error, loading, isTrialExpired, formatDate, handleSubscribe } = useSubscription({
    freeTrialDays: 3,
  });

  return (
    <SubscriptionContent
      plan={plan}
      error={error}
      loading={loading}
      isTrialExpired={isTrialExpired}
      formatDate={formatDate}
      handleSubscribe={handleSubscribe}
      isSidePanel={false}
    />
  );
};

export default Subscription;