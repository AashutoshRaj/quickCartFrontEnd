import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { useVerifyOTP } from '../queries/authQueries';
import { initMsg91Widget } from '../api/VerifyOtp/SendOTP';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  // TanStack Query Hooks
  const { mutate: verifyOTP, isPending: isVerifyingOTP, error: verifyOTPError } = useVerifyOTP();

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    try {
      authService.initRecaptcha('recaptcha-container');
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
    }

    // Cleanup on unmount
    return () => {
      authService.cleanup();
    };
  }, []);

  const handleSendOTP = (e) => {
    if (e) e.preventDefault();
    if (phoneNumber.length < 10) return;

    initMsg91Widget({
      phoneNumber,
      onSuccess: (accessToken) => {
        verifyOTP(accessToken, {
          onSuccess: (res) => {
            if (res.status === 'success') navigate('/');
          },
        });
      },
      onFailure: (error) => {
        console.error('OTP Verification Failed:', error);
      }
    });
  };

  const error = verifyOTPError?.response?.data?.message;
  const loading = isVerifyingOTP;

  return (
    <div className="min-h-screen bg-background flex flex-col p-8 relative">
      {/* reCAPTCHA Container - Hidden, used for reCAPTCHA verification */}
      <div id="recaptcha-container" className="invisible absolute"></div>

      {/* Header / Logo */}
      <div className="flex justify-center mt-12 mb-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary p-4 rounded-[2rem] shadow-xl shadow-primary/20"
        >
          <ShoppingBag size={40} className="text-white" strokeWidth={2.5} />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-3 text-center">
            <h1 className="text-on-surface font-poppins font-bold text-3xl tracking-tight">Welcome Back</h1>
            <p className="text-secondary font-inter text-sm leading-relaxed px-6">
              Secure access to your QuickCart account
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-outline/5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-on-surface font-poppins font-bold text-lg">Login or Sign Up</h2>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <span className="text-on-surface font-inter font-bold mr-3 border-r border-outline/10 pr-3">+91</span>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="000 000 0000" 
                    className="flex-1 bg-transparent outline-none font-inter text-on-surface placeholder:text-outline/40"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-destructive text-xs font-inter font-medium text-center">{error}</p>
            )}

            <button 
              onClick={handleSendOTP}
              disabled={loading || phoneNumber.length < 10}
              className="w-full bg-primary py-5 rounded-2xl shadow-xl shadow-primary/20 text-white font-poppins font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Get Verification Code'}
            </button>
          </div>

          <p className="text-[11px] text-center text-secondary font-inter leading-relaxed px-8">
            By continuing, you agree to QuickCart's <br/>
            <span className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span> & <span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>

      {/* Security Badge */}
      <div className="pb-10 flex flex-col items-center gap-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/50 backdrop-blur-sm border border-outline/5 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm"
        >
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <span className="text-[10px] font-bold text-on-surface/60 tracking-wider uppercase">Bank-Grade Encryption</span>
        </motion.div>
      </div>
    </div>
  );
}


