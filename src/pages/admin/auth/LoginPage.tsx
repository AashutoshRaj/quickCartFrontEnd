import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { AuthShell } from './AuthShell';
import { ADMIN_PATHS } from '../../../admin-routes/RouteConstants';
import { useAuth } from '../../../admin-auth/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    try {
      await login({
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
      });

      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || ADMIN_PATHS.dashboard, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Login to Admin Console"
      subtitle="Access your workspace and continue managing your store."
    >
      <form className="mt-14 space-y-9" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
            Work Email
          </label>
          <div className="relative mt-4">
            <Mail className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
            <input
              id="email"
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm uppercase tracking-[0.12em] text-slate-700" style={{ fontWeight: 800 }}>
              Password
            </label>
            <a href="#" className="text-sm text-emerald-800 hover:text-emerald-700" style={{ fontWeight: 800 }}>Forgot Password?</a>
          </div>
          <div className="relative mt-4">
            <Lock className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#6f806f]" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

        <label className="flex items-center gap-4 text-lg text-slate-700">
          <input
            type="checkbox"
            className="h-6 w-6 rounded border border-[#a8bda5] accent-emerald-600"
          />
          Keep me logged in for 30 days
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`flex h-[78px] w-full items-center justify-center gap-4 rounded-lg bg-[#05d456] text-2xl text-[#062915] shadow-[0_12px_18px_rgba(15,23,42,0.12)] transition-colors hover:bg-[#04c94f] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{ fontWeight: 800 }}
        >
          {loading ? (
            <>
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#062915] border-t-transparent" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRight className="h-7 w-7" />
            </>
          )}
        </button>
      </form>

      <p className="mt-14 text-center text-lg text-slate-600">
        New to QuickCart?{' '}
        <Link to="/admin/signup" className="text-emerald-800 hover:text-emerald-700" style={{ fontWeight: 800 }}>
          Create admin account
        </Link>
      </p>
    </AuthShell>
  );
}
