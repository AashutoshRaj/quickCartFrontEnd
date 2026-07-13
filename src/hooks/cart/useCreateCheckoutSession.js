import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import cartService from '../../api/services/cartService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: () => cartService.createCheckoutSession(),
    onSuccess: async (data) => {
      const sessionId = data?.data?.checkoutSessionId;
      const url = data?.data?.url;

      if (sessionId) {
        try {
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error('Stripe could not be initialized.');
          }

          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Stripe redirect error:', error);
          if (url) {
            window.location.assign(url);
          } else {
            toast.error(error.message || 'Unable to start checkout.');
          }
        }
        return;
      }

      if (url) {
        window.location.assign(url);
        return;
      }

      toast.error('Checkout session was not created successfully.');
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Unable to start checkout.';
      toast.error(message);
    },
  });
};
