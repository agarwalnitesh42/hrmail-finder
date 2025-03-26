import { useState, useEffect } from 'react';

interface SubscriptionPlan {
  type: 'free' | 'paid';
  startDate: string;
  endDate: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

interface UseSubscriptionProps {
  freeTrialDays: number;
  onSuccessfulSubscription?: () => void;
}

export const useSubscription = ({ freeTrialDays, onSuccessfulSubscription }: UseSubscriptionProps) => {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load Cashfree SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => console.log('Cashfree SDK loaded');
    script.onerror = () => setError('Failed to load payment gateway. Please try again.');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check for existing subscription on mount
  useEffect(() => {
    chrome.storage.local.get(['subscription'], (result) => {
      if (result.subscription) {
        setPlan(result.subscription);
      } else {
        // No subscription found, start free trial
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + freeTrialDays);

        const freePlan: SubscriptionPlan = {
          type: 'free',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          paymentStatus: 'completed',
        };

        chrome.storage.local.set({ subscription: freePlan }, () => {
          setPlan(freePlan);
        });
      }
    });
  }, [freeTrialDays]);

  // Check if the free trial has expired
  const isTrialExpired = (plan: SubscriptionPlan): boolean => {
    if (plan.type !== 'free') return false;
    const endDate = new Date(plan.endDate);
    const now = new Date();
    return now > endDate;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle subscription payment
  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate server-side order creation (in a real app, this would be a backend API call)
      const orderResponse = await fetch('https://your-backend-api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 399, // ₹399
          currency: 'INR',
          customer_id: 'user_' + Date.now(), // Replace with actual user ID
          customer_email: 'user@example.com', // Replace with actual user email
          customer_phone: '9999999999', // Replace with actual user phone
        }),
      });

      const orderData = await orderResponse.json();
      const { order_id, payment_session_id } = orderData;

      // Initialize Cashfree
      const cashfree = (window as any).Cashfree({
        mode: 'sandbox', // Use 'production' in live environment
      });

      // Open Cashfree payment popup
      cashfree.checkout({
        paymentSessionId: payment_session_id,
        returnUrl: 'https://your-backend-api/verify-payment?order_id={order_id}',
      }).then((result: any) => {
        if (result.error) {
          setError('Payment failed: ' + result.error.message);
          setLoading(false);
          return;
        }

        if (result.payment.status === 'SUCCESS') {
          const startDate = new Date();
          const endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + 5); // 5 months subscription

          const paidPlan: SubscriptionPlan = {
            type: 'paid',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            paymentStatus: 'completed',
          };

          chrome.storage.local.set({ subscription: paidPlan }, () => {
            setPlan(paidPlan);
            setLoading(false);
            if (onSuccessfulSubscription) {
              onSuccessfulSubscription();
            }
          });
        } else {
          setError('Payment failed. Please try again.');
          setLoading(false);
        }
      });
    } catch (err) {
      setError('Failed to initiate payment: ' + (err as Error).message);
      setLoading(false);
    }
  };

  return {
    plan,
    error,
    loading,
    isTrialExpired,
    formatDate,
    handleSubscribe,
  };
};