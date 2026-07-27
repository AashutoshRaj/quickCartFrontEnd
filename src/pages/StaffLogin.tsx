import React, { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '../app/paths';
import { staffLogin } from '../api/staffAuthApi';
import { setStaffAuth } from '../store/slices/staffAuthSlice.ts';

interface StaffLoginFormData extends FieldValues {
  identifier: string;
  password: string;
}

/**
 * Staff Login Page
 * Email/Employee ID + password login for Security Guards and Employees.
 * Fully separate from the customer phone-OTP login flow.
 */
const StaffLogin: React.FC = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormData>({
    mode: 'onChange',
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (data: StaffLoginFormData): Promise<void> => {
    setLoading(true);
    try {
      const response = await staffLogin(data.identifier.trim(), data.password);
      dispatch(setStaffAuth({ staffUser: response.data, staffToken: response.token }));
      localStorage.setItem('quickcart_onboarded', 'true');
      toast.success('Login successful 🎉');
      navigate(PATHS.STAFF_HOME);
    } catch (error) {
      console.error(error);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-background flex flex-col relative overflow-auto pt-[15px]">
      <div className="flex justify-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary p-4 rounded-[2rem] shadow-xl shadow-primary/20"
        >
          <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-[15px]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-on-surface font-poppins font-bold text-3xl tracking-tight">Staff Login</h1>
            <p className="text-secondary font-inter text-sm leading-relaxed px-6">
              Sign in with your Employee ID or email to access staff features
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 rounded-[10px] shadow-sm border border-outline/5 space-y-6"
            noValidate
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">
                  Employee ID or Email
                </label>
                <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4">
                  <input
                    type="text"
                    placeholder="SG-0001 or you@quickcart.com"
                    className="flex-1 bg-transparent outline-none"
                    aria-invalid={!!errors.identifier}
                    {...register('identifier', { required: 'Employee ID or email is required' })}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs font-inter text-red-500 ml-1">{errors.identifier.message as string}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4">
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="flex-1 bg-transparent outline-none"
                    aria-invalid={!!errors.password}
                    {...register('password', { required: 'Password is required' })}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-inter text-red-500 ml-1">{errors.password.message as string}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-2 rounded-[5px] shadow-xl shadow-primary/20 text-white font-poppins font-normal text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>

          <p className="text-[11px] text-center text-secondary font-inter leading-relaxed px-8">
            Credentials issued by your store admin. Contact them if you don't have login details.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffLogin;
