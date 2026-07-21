/**
 * Create Checkout Session Hook
 * Manages payment checkout session creation and Stripe redirect
 */

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import cartService from '../../api/services/cartService.ts';
import type { CheckoutSessionResponse } from '../../types/index';

/**
 * Load and cache Stripe promise
 * Prevents multiple Stripe initialization calls
 */
const stripePromise: Promise<Stripe | null> = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
);

/**
 * Hook to create checkout session and redirect to Stripe
 *
 * @returns {UseMutationResult} Mutation result for checkout session
 * @returns {CheckoutSessionResponse | undefined} data - Session response
 * @returns {boolean} isPending - Loading state
 * @returns {boolean} isError - Error state
 * @returns {Error | null} error - Error object if mutation fails
 * @returns {Function} mutate - Function to create checkout session
 *
 * @remarks
 * - Creates checkout session on backend
 * - Redirects to Stripe checkout if sessionId provided
 * - Falls back to URL redirect if Stripe fails
 * - Shows error notifications on failure
 *
 * @example
 * const { mutate: startCheckout, isPending } = useCreateCheckoutSession();
 * startCheckout();
 */
export const useCreateCheckoutSession = (): UseMutationResult<
  CheckoutSessionResponse,
  Error,
  void
> => {
  return useMutation({
    mutationFn: () => cartService.createCheckoutSession(),
    onSuccess: async (data: CheckoutSessionResponse & Record<string, unknown>) => {
      const sessionId = (data as Record<string, unknown>)?.data?.checkoutSessionId as string;
      const url = (data as Record<string, unknown>)?.data?.url as string;

      /**
       * If session ID provided, redirect to Stripe checkout
       */
      if (sessionId) {
        try {
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error('Stripe could not be initialized.');
          }

          /**
           * Redirect to Stripe checkout
           */
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw error;
          }
        } catch (error) {
          console.error('Stripe redirect error:', error);

          /**
           * Fallback to URL redirect
           */
          if (url) {
            window.location.assign(url);
          } else {
            toast.error((error as Error).message || 'Unable to start checkout.');
          }
        }
        return;
      }

      /**
       * Fallback to direct URL redirect if no session ID
       */
      if (url) {
        window.location.assign(url);
        return;
      }

      /**
       * No valid checkout data
       */
      toast.error('Checkout session was not created successfully.');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      /**
       * Extract error message and show notification
       */
      const message = error?.response?.data?.message || 'Unable to start checkout.';
      toast.error(message);
    },
  });
};
