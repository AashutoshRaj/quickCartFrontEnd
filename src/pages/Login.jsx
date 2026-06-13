import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import {
  useCheckPhone,
  useCompleteRegistration,
  useSendOTP,
  useVerifyOTP,
} from '../queries/authQueries';

export default function Login() {
  const [authStep, setAuthStep] = useState('phone');
  const [registrationToken, setRegistrationToken] = useState('');
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      otp: '',
    },
  });

  const navigate = useNavigate();
  const checkPhoneMutation = useCheckPhone();
  const sendOTPMutation = useSendOTP();
  const verifyOTPMutation = useVerifyOTP();
  const completeRegistrationMutation = useCompleteRegistration();
  const loading =
    checkPhoneMutation.isPending ||
    sendOTPMutation.isPending ||
    verifyOTPMutation.isPending ||
    completeRegistrationMutation.isPending;
  const showOtpInput = authStep === 'otp' || authStep === 'name';
  const showNameInput = authStep === 'name';
  const phoneNumber = useWatch({ control, name: 'phoneNumber' }) || '';
  const otp = useWatch({ control, name: 'otp' }) || '';
  const name = useWatch({ control, name: 'name' }) || '';

  const handleCheckAndSendOTP = async ({ phoneNumber }) => {
    try {
      await checkPhoneMutation.mutateAsync(phoneNumber);
      const data = await sendOTPMutation.mutateAsync(phoneNumber);

      if (data.success || data.status === 'success') {
        setAuthStep('otp');
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

  const handleVerifyOTP = async ({ phoneNumber, otp }) => {
    try {
      const data = await verifyOTPMutation.mutateAsync({ phoneNumber, otp });

      if (data.requiresRegistration) {
        setRegistrationToken(data.registrationToken);
        setAuthStep('name');
        return;
      }

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

  const handleCompleteRegistration = async ({ name }) => {
    try {
      const data = await completeRegistrationMutation.mutateAsync({
        name,
        registrationToken,
      });

      if (data.success || data.status === 'success') {
        alert('Registration Successful');
        navigate('/');
      }
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          'Failed to complete registration'
      );
    }
  };

  const onSubmit = (formData) => {
    if (authStep === 'name') {
      return handleCompleteRegistration(formData);
    }

    return authStep === 'otp'
      ? handleVerifyOTP(formData)
      : handleCheckAndSendOTP(formData);
  };

  return (
    <div className="h-dvh bg-background flex flex-col  relative overflow-auto">
      {/* Header / Logo */}
      <div className="flex justify-center  mb-10">
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

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-[15px]">
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-4 rounded-[10px] shadow-sm border border-outline/5 space-y-6"
            noValidate
          >
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
                    placeholder="0000000000"
                    className="flex-1 bg-transparent outline-none"
                    aria-invalid={!!errors.phoneNumber}
                    disabled={authStep !== 'phone'}
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit phone number',
                      },
                      onChange: (e) => {
                        setValue(
                          'phoneNumber',
                          e.target.value.replace(/\D/g, '').slice(0, 10),
                          { shouldValidate: true }
                        );
                        setAuthStep('phone');
                        setRegistrationToken('');
                      },
                    })}
                  />
                </div>

                {errors.phoneNumber && (
                  <p className="text-xs font-inter text-red-500 ml-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
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
                      placeholder="Enter OTP"
                      className="flex-1 bg-transparent outline-none"
                      aria-invalid={!!errors.otp}
                      {...register('otp', {
                        required: showOtpInput
                          ? 'Verification code is required'
                          : false,
                        pattern: showOtpInput
                          ? {
                              value: /^\d{6}$/,
                              message: 'Enter a valid 6-digit OTP',
                            }
                          : undefined,
                        onChange: (e) => {
                          setValue(
                            'otp',
                            e.target.value.replace(/\D/g, '').slice(0, 6),
                            { shouldValidate: true }
                          );
                        },
                      })}
                    />
                  </div>

                  {errors.otp && (
                    <p className="text-xs font-inter text-red-500 ml-1">
                      {errors.otp.message}
                    </p>
                  )}
                </div>
              )}

              {showNameInput && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary font-inter uppercase tracking-[0.2em] ml-1">
                    Name
                  </label>

                  <div className="flex items-center bg-background border border-outline/10 rounded-2xl p-4">
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="flex-1 bg-transparent outline-none"
                      aria-invalid={!!errors.name}
                      {...register('name', {
                        required: showNameInput
                          ? 'Name is required'
                          : false,
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: 'Name can contain only letters',
                        },
                        setValueAs: (value) => value.trimStart(),
                      })}
                    />
                  </div>

                  {errors.name && (
                    <p className="text-xs font-inter text-red-500 ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                (authStep === 'phone' && phoneNumber.length !== 10) ||
                (authStep === 'otp' && otp.length !== 6) ||
                (authStep === 'name' && name.trim().length < 2)
              }
              className="w-full bg-primary py-2 rounded-[5px] shadow-xl shadow-primary/20 text-white font-poppins font-normal text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2
                  className="animate-spin"
                  size={20}
                />
              ) : showOtpInput ? (
                showNameInput ? (
                  'Complete Registration'
                ) : (
                  'Verify OTP'
                )
              ) : (
                'Send OTP'
              )}
            </button>
              <span className='block text-center'>OR</span>

              <button className='w-full bg-white py-2 rounded-[5px]   text-primary font-poppins font-normal text-lg hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50  flex items-center justify-center gap-2 border '>
                Login with Google
              </button>

          </form>

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
      {/* <div className="pb-10 flex flex-col items-center gap-2">
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
      </div> */}
    </div>
  );
}
