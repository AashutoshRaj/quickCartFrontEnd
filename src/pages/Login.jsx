import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { useSendOTP, useVerifyOTP } from '../queries/authQueries';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();
  const loading = sendOTPMutation.isPending || verifyOTPMutation.isPending;

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    if (phoneNumber.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const data = await sendOTPMutation.mutateAsync(phoneNumber);

      if (data.success || data.status === 'success') {
        setShowOtpInput(true);
        alert('OTP sent successfully');
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          'Failed to send OTP'
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const data = await verifyOTPMutation.mutateAsync({ phoneNumber, otp });

      if (data.success || data.status === 'success') {
        alert('Login Successful');
        navigate('/');
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          'Invalid OTP'
      );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-8 relative">
      {/* Header / Logo */}
      <div className="flex justify-center mt-12 mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary p-4 rounded-[2rem] shadow-xl shadow-primary/20"
        >
          <ShoppingBag
            size={40}
            className="text-white"
            strokeWidth={2.5}
          />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-3 text-center">
            <h1 className="text-on-surface font-poppins font-bold text-3xl tracking-tight">
              Welcome Back
            </h1>

            <p className="text-secondary font-inter text-sm leading-relaxed px-6">
              Secure access to your QuickCart account
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-outline/5 space-y-6">
            <div className="space-y-4">
              <h2 className="text-on-surface font-poppins font-bold text-lg">
                Login or Sign Up
              </h2>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">
                  Phone Number
                </label>

                <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4">
                  <span className="text-on-surface font-bold mr-3 border-r border-outline/10 pr-3">
                    +91
                  </span>

                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10)
                      )
                    }
                    placeholder="0000000000"
                    className="flex-1 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* OTP Input */}
              {showOtpInput && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">
                    Verification Code
                  </label>

                  <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(/\D/g, '')
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter OTP"
                      className="flex-1 bg-transparent outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={
                showOtpInput
                  ? handleVerifyOTP
                  : handleSendOTP
              }
              disabled={
                loading ||
                (!showOtpInput &&
                  phoneNumber.length !== 10) ||
                (showOtpInput && otp.length !== 6)
              }
              className="w-full bg-primary py-5 rounded-2xl shadow-xl shadow-primary/20 text-white font-poppins font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2
                  className="animate-spin"
                  size={20}
                />
              ) : showOtpInput ? (
                'Verify OTP'
              ) : (
                'Get Verification Code'
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-secondary font-inter leading-relaxed px-8">
            By continuing, you agree to QuickCart's
            <br />
            <span className="text-primary font-bold hover:underline cursor-pointer">
              Terms of Service
            </span>{' '}
            &{' '}
            <span className="text-primary font-bold hover:underline cursor-pointer">
              Privacy Policy
            </span>
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
            <ShieldCheck
              size={18}
              className="text-primary"
            />
          </div>

          <span className="text-[10px] font-bold text-on-surface/60 tracking-wider uppercase">
            Bank-Grade Encryption
          </span>
        </motion.div>
      </div>
    </div>
  );
}
