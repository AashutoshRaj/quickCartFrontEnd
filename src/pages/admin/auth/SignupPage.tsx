import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, Store, User } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { ADMIN_PATHS } from '../../../admin-routes/RouteConstants';
import { useAuth } from '../../../admin-auth/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await signup({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        storeName: String(formData.get('storeName') || ''),
        password: String(formData.get('password') || ''),
        phone: String(formData.get('phone') || '') || undefined,
      });

      navigate(ADMIN_PATHS.dashboard, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const validationMsgs = err.response.data.errors.map((e: any) => e.message).join(', ');
        setError(validationMsgs);
      } else {
        setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Admin Account"
      subtitle="Set up your workspace and start managing your store."
    >
      <form className="mt-14 space-y-9" onSubmit={handleSubmit}>
        <div className="grid gap-9 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
              Full Name
            </label>
            <div className="relative mt-4">
              <User className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className="h-[74px] w-full border border-[#a8bda5] bg-white pl-13 pr-4 text-xl text-slate-800 outline-none transition-colors placeholder:text-[#b3c6b0] focus:border-emerald-600"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="store-name" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
              Store Name
            </label>
            <div className="relative mt-4">
              <Store className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
              <input
                id="store-name"
                name="storeName"
                type="text"
                autoComplete="organization"
                placeholder="QuickCart Central"
                className="h-[74px] w-full border border-[#a8bda5] bg-white pl-13 pr-4 text-xl text-slate-800 outline-none transition-colors placeholder:text-[#b3c6b0] focus:border-emerald-600"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
            Work Email
          </label>
          <div className="relative mt-4">
            <Mail className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@store.com"
              className="h-[74px] w-full border border-[#a8bda5] bg-white pl-13 pr-4 text-xl text-slate-800 outline-none transition-colors placeholder:text-[#b3c6b0] focus:border-emerald-600"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
            Phone Number
          </label>
          <div className="relative mt-4">
            <Phone className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className="h-[74px] w-full border border-[#a8bda5] bg-white pl-13 pr-4 text-xl text-slate-800 outline-none transition-colors placeholder:text-[#b3c6b0] focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
            Password
          </label>
          <div className="relative mt-4">
            <Lock className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              className="h-[74px] w-full border border-[#a8bda5] bg-white pl-13 pr-14 text-xl text-slate-800 outline-none transition-colors placeholder:text-[#b3c6b0] focus:border-emerald-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f] hover:text-emerald-700 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`flex h-[78px] w-full items-center justify-center gap-4 rounded-lg bg-[#05d456] text-2xl text-[#062915] shadow-[0_12px_18px_rgba(15,23,42,0.12)] transition-colors hover:bg-[#04c94f] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{ fontWeight: 800 }}
        >
          {loading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#062915] border-t-transparent" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-7 w-7" />
            </>
          )}
        </button>
      </form>

      <p className="mt-14 text-center text-lg text-slate-600">
        Already have an account?{' '}
        <Link to="/admin/login" className="text-emerald-800 hover:text-emerald-700" style={{ fontWeight: 800 }}>
          Login instead
        </Link>
      </p>
    </AuthShell>
  );
}
