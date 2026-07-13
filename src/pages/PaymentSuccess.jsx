import { CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-green-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-green-600" />
        <h1 className="font-poppins text-2xl font-bold text-on-surface">Payment Successful</h1>
        <p className="mt-3 text-sm text-secondary">
          Your order has been confirmed. Stripe session: {sessionId || 'unknown'}
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 font-poppins font-semibold text-white">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
