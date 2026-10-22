import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch, type FieldValues } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronDown, Eye, EyeOff, Loader2, ScanFace, ShoppingBag } from 'lucide-react';
import { PATHS } from '../app/paths';
import {
  useCheckPhone,
  useCompleteRegistration,
  useSendOTP,
  useVerifyOTP,
} from '../queries/authQueries.ts';
import { staffLogin } from '../api/staffAuthApi';
import { setStaffAuth } from '../store/slices/staffAuthSlice.ts';
import { toast } from 'sonner';

interface LoginFormData extends FieldValues {
  name: string;
  phoneNumber: string;
  otp: string;
}

interface OTPVerifyResponse {
  requiresRegistration?: boolean;
  registrationToken?: string;
  success?: boolean;
  status?: string;
}

interface RegistrationResponse {
  success?: boolean;
  status?: string;
}

interface SendOTPResponse {
  success?: boolean;
  status?: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  minDigits: number;
  maxDigits: number;
  format: (digits: string) => string;
  isValid: (digits: string) => boolean;
}

const groupPhone = (digits: string, groups: number[]): string => {
  let cursor = 0;
  return groups
    .map((group) => {
      const part = digits.slice(cursor, cursor + group);
      cursor += group;
      return part;
    })
    .filter(Boolean)
    .join(' ');
};

const getNationalDigits = (value: string, country: Country): string => {
  const digits = value.replace(/\D/g, '');
  const dialDigits = country.dialCode.replace('+', '');

  // Accept an international value pasted into the local-number field, but
  // remove the country code before formatting and validating it.
  if (digits.startsWith(dialDigits) && digits.length > country.maxDigits) {
    return digits.slice(dialDigits.length);
  }

  return digits;
};

const toInternationalPhoneNumber = (nationalDigits: string, country: Country): string => {
  return `${country.dialCode}${nationalDigits.replace(/^0+/, '')}`;
};

const COUNTRIES: Country[] = [
  {
    code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', minDigits: 8, maxDigits: 10,
    format: (digits) => digits.length <= 9 ? groupPhone(digits, [2, 3, 4]) : groupPhone(digits, [3, 3, 4]),
    isValid: (digits) => /^(?:0?(?:50|52|54|55|56|58)\d{7})$/.test(digits),
  },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', minDigits: 10, maxDigits: 10, format: (digits) => groupPhone(digits, [5, 5]), isValid: (digits) => /^[6-9]\d{9}$/.test(digits) },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', minDigits: 10, maxDigits: 10, format: (digits) => digits.length > 3 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}${digits.length > 6 ? `-${digits.slice(6)}` : ''}` : digits, isValid: (digits) => /^[2-9]\d{9}$/.test(digits) },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', minDigits: 10, maxDigits: 10, format: (digits) => digits.length > 3 ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}${digits.length > 6 ? `-${digits.slice(6)}` : ''}` : digits, isValid: (digits) => /^[2-9]\d{9}$/.test(digits) },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', minDigits: 10, maxDigits: 10, format: (digits) => groupPhone(digits, [4, 3, 3]), isValid: (digits) => /^7\d{9}$/.test(digits) },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', minDigits: 9, maxDigits: 10, format: (digits) => groupPhone(digits, [2, 3, 4]), isValid: (digits) => /^(?:0?5\d{8})$/.test(digits) },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', minDigits: 8, maxDigits: 8, format: (digits) => groupPhone(digits, [4, 4]), isValid: (digits) => /^[3-7]\d{7}$/.test(digits) },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', minDigits: 8, maxDigits: 8, format: (digits) => groupPhone(digits, [4, 4]), isValid: (digits) => /^[569]\d{7}$/.test(digits) },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', minDigits: 8, maxDigits: 8, format: (digits) => groupPhone(digits, [4, 4]), isValid: (digits) => /^[79]\d{7}$/.test(digits) },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', minDigits: 9, maxDigits: 10, format: (digits) => digits.length > 1 ? `${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5)}`.trim() : digits, isValid: (digits) => /^4\d{8}$/.test(digits) },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', minDigits: 10, maxDigits: 11, format: (digits) => groupPhone(digits, [3, 3, 4]), isValid: (digits) => /^1[5-7]\d{8,9}$/.test(digits) },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', minDigits: 9, maxDigits: 9, format: (digits) => groupPhone(digits, [1, 2, 2, 2, 2]), isValid: (digits) => /^[67]\d{8}$/.test(digits) },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', minDigits: 10, maxDigits: 11, format: (digits) => groupPhone(digits, [4, 3, 4]), isValid: (digits) => /^3\d{9}$/.test(digits) },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', minDigits: 8, maxDigits: 8, format: (digits) => groupPhone(digits, [4, 4]), isValid: (digits) => /^[689]\d{7}$/.test(digits) },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', minDigits: 9, maxDigits: 10, format: (digits) => groupPhone(digits, [2, 3, 4]), isValid: (digits) => /^7\d{8}$/.test(digits) },
];

const DEFAULT_COUNTRY: Country = COUNTRIES[0]!;

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Label + rounded input shell shared by every text field on this screen,
 * so focus glow / border treatment stays in one place.
 */
const FieldShell: React.FC<{
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary"
    >
      {label}
    </label>
    <div className="flex items-center rounded-2xl border border-border bg-input-bg px-4 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]">
      {children}
    </div>
    {error && (
      <p className="ml-1 text-xs text-error" role="alert">
        {error}
      </p>
    )}
  </div>
);

const Login: React.FC = (): React.ReactElement => {
  const location = useLocation();
  const initialAuthMode = (location.state as { authMode?: 'phone' | 'staff' } | null)?.authMode ?? 'phone';
  const [authMode, setAuthMode] = useState<'phone' | 'staff'>(initialAuthMode);
  const [authStep, setAuthStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [registrationToken, setRegistrationToken] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [staffLoginPending, setStaffLoginPending] = useState(false);

  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      otp: '',
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const localPhoneDigits = getNationalDigits(phoneNumber, selectedCountry);
  const isPhoneValid = selectedCountry.isValid(localPhoneDigits);
  const completePhoneNumber = toInternationalPhoneNumber(localPhoneDigits, selectedCountry);

  register('otp', {
    required: showOtpInput ? 'Verification code is required' : false,
    pattern: showOtpInput
      ? { value: /^\d{6}$/, message: 'Enter a valid 6-digit OTP' }
      : undefined,
  });

  useEffect(() => {
    if (authStep === 'otp') {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      otpInputRefs.current[0]?.focus();
    }
  }, [authStep]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleCheckAndSendOTP = async (): Promise<void> => {
    try {
      await checkPhoneMutation.mutateAsync(completePhoneNumber);
      const response = await sendOTPMutation.mutateAsync(completePhoneNumber);

      if ((response as SendOTPResponse).success || (response as SendOTPResponse).status === 'success') {
        setAuthStep('otp');
        toast.success('OTP sent successfully 🎉');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send OTP');
    }
  };

  const handleResendOTP = async (): Promise<void> => {
    if (resendCooldown > 0 || loading) return;
    try {
      await sendOTPMutation.mutateAsync(completePhoneNumber);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success('OTP resent 🎉');
    } catch (error) {
      console.error(error);
      toast.error('Failed to resend OTP');
    }
  };

  const handleVerifyOTP = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await verifyOTPMutation.mutateAsync({ phoneNumber: completePhoneNumber, otp: data.otp });

      if ((response as OTPVerifyResponse).requiresRegistration) {
        setRegistrationToken((response as OTPVerifyResponse).registrationToken || '');
        setAuthStep('name');
        return;
      }

      if ((response as OTPVerifyResponse).success || (response as OTPVerifyResponse).status === 'success') {
        localStorage.setItem('quickcart_onboarded', 'true');
        toast.success('Login successful 🎉');
        navigate(PATHS.HOME);
      }
    } catch (error) {
      console.error(error);
      toast.error('Invalid OTP');
    }
  };

  const handleCompleteRegistration = async (data: LoginFormData): Promise<void> => {
    try {
      const response = await completeRegistrationMutation.mutateAsync({
        name: data.name,
        registrationToken,
      });

      if ((response as RegistrationResponse).success || (response as RegistrationResponse).status === 'success') {
        localStorage.setItem('quickcart_onboarded', 'true');
        toast.success('Login successful 🎉');
        navigate(PATHS.HOME);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to complete registration');
    }
  };

  const onSubmit = (formData: LoginFormData): void | Promise<void> => {
    if (authStep === 'name') {
      return handleCompleteRegistration(formData);
    }

    return authStep === 'otp'
      ? handleVerifyOTP(formData)
      : handleCheckAndSendOTP();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const digits = getNationalDigits(e.target.value, selectedCountry).slice(0, selectedCountry.maxDigits);
    setValue(
      'phoneNumber',
      selectedCountry.format(digits),
      { shouldValidate: true }
    );
    setAuthStep('phone');
    setRegistrationToken('');
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const country = COUNTRIES.find(({ code }) => code === e.target.value) || DEFAULT_COUNTRY;
    setSelectedCountry(country);
    setValue('phoneNumber', '', { shouldValidate: true });
    setAuthStep('phone');
    setRegistrationToken('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue('name', e.target.value.trimStart());
  };

  const otpDigits = Array.from({ length: OTP_LENGTH }, (_, i) => otp[i] || '');

  const setOtpValue = (nextOtp: string): void => {
    setValue('otp', nextOtp.replace(/\D/g, '').slice(0, OTP_LENGTH), { shouldValidate: true });
  };

  const handleOtpBoxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) {
      const chars = otpDigits.slice();
      chars[index] = '';
      setOtpValue(chars.join(''));
      return;
    }
    const chars = otpDigits.slice();
    chars[index] = digits[digits.length - 1] ?? '';
    setOtpValue(chars.join(''));
    if (index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        const chars = otpDigits.slice();
        chars[index] = '';
        setOtpValue(chars.join(''));
      } else if (index > 0) {
        const chars = otpDigits.slice();
        chars[index - 1] = '';
        setOtpValue(chars.join(''));
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setOtpValue(pasted);
    otpInputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleStaffSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setStaffLoginPending(true);
    try {
      const response = await staffLogin(identifier.trim(), password);
      dispatch(setStaffAuth({ staffUser: response.data, staffToken: response.token }));
      localStorage.setItem('quickcart_onboarded', 'true');
      toast.success('Login successful 🎉');
      navigate(PATHS.STAFF_HOME);
    } catch (error) {
      console.error(error);
      toast.error('Invalid credentials');
    } finally {
      setStaffLoginPending(false);
    }
  };

  const notReady = (label: string) => () => toast.info(`${label} is coming soon`);

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-background"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 0.75rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.75rem)',
      }}
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary opacity-[0.16] blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-accent opacity-[0.14] blur-3xl" />
        <div
          className="absolute left-0 top-0 h-44 w-44 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(var(--color-text-secondary) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col justify-between px-5">
        {/* Header */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col items-center pt-4 text-center"
        >
          <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-[1.25rem] bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] shadow-lg shadow-primary/30">
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag size={28} className="text-surface" strokeWidth={2.5} />
            </div>
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(115deg, transparent 20%, var(--color-shimmer) 50%, transparent 80%)',
              }}
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 1.9, ease: 'easeInOut' }}
            />
          </div>
          <h1 className="font-poppins text-[28px] font-extrabold leading-tight text-text-primary">
            Welcome Back
          </h1>
          <p className="mt-1 font-inter text-sm text-text-secondary">
            Sign in to continue shopping
          </p>
        </motion.div>

        {/* Tabs + Form — centered in remaining space between header and footer */}
        <div className="flex flex-1 flex-col justify-center">
          {/* Tabs */}
          <motion.div
            custom={0.15}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-6"
          >
            <div
              role="tablist"
              aria-label="Sign-in method"
              className="relative grid grid-cols-2 rounded-full border border-border bg-surface p-1"
            >
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))]"
                animate={{ left: authMode === 'phone' ? '4px' : '50%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
              <button
                type="button"
                role="tab"
                id="tab-phone"
                aria-selected={authMode === 'phone'}
                aria-controls="panel-phone"
                onClick={() => setAuthMode('phone')}
                className={`relative z-10 h-11 min-h-11 rounded-full font-poppins text-sm font-semibold transition-colors ${
                  authMode === 'phone' ? 'text-surface' : 'text-text-secondary'
                }`}
              >
                I'm a Shopper
              </button>
              <button
                type="button"
                role="tab"
                id="tab-staff"
                aria-selected={authMode === 'staff'}
                aria-controls="panel-staff"
                onClick={() => setAuthMode('staff')}
                className={`relative z-10 h-11 min-h-11 rounded-full font-poppins text-sm font-semibold transition-colors ${
                  authMode === 'staff' ? 'text-surface' : 'text-text-secondary'
                }`}
              >
                I'm Staff
              </button>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-5 rounded-[1.25rem] border border-border/60 bg-surface p-4 shadow-[0_2px_8px_color-mix(in_srgb,var(--color-text-primary)_5%,transparent),0_20px_45px_-14px_color-mix(in_srgb,var(--color-text-primary)_18%,transparent)] backdrop-blur-sm transition-shadow duration-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              {authMode === 'phone' ? (
                <motion.form
                  key="phone"
                  id="panel-phone"
                  role="tabpanel"
                  aria-labelledby="tab-phone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <FieldShell
                    label="Phone Number"
                    htmlFor="phoneNumber"
                    error={errors.phoneNumber?.message as string}
                  >
                    <div className="relative mr-3 flex items-center border-r border-border pr-5">
                      <span className="mr-1.5 text-lg leading-none" aria-hidden="true">{selectedCountry.flag}</span>
                      <select
                        aria-label="Country"
                        value={selectedCountry.code}
                        onChange={handleCountryChange}
                        disabled={authStep !== 'phone'}
                        title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
                        className="h-[52px] w-5 appearance-none bg-transparent text-transparent outline-none disabled:cursor-not-allowed [&>option]:text-text-primary"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.flag} {country.name} ({country.dialCode})
                          </option>
                        ))}
                      </select>
                      <span className="ml-1 whitespace-nowrap font-bold text-text-primary" aria-hidden="true">
                        {selectedCountry.dialCode}
                      </span>
                      <ChevronDown size={15} className="pointer-events-none absolute right-0 text-text-secondary" aria-hidden="true" />
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      // inputMode="numeric"
                      placeholder={selectedCountry.code === 'AE' ? '501234567' : 'Phone number'}
                      className="h-[52px] min-w-0 flex-1 bg-transparent font-inter text-text-primary outline-none placeholder:text-text-secondary/60"
                      aria-invalid={!!errors.phoneNumber}
                      disabled={authStep !== 'phone'}
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        validate: (value) => selectedCountry.isValid(getNationalDigits(String(value), selectedCountry))
                          || `Enter a valid ${selectedCountry.name} phone number`,
                        onChange: handlePhoneChange,
                      })}
                    />
                  </FieldShell>

                  <AnimatePresence>
                    {showOtpInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="ml-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                          Verification Code
                        </label>
                        <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => {
                                otpInputRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              aria-label={`OTP digit ${index + 1}`}
                              aria-invalid={!!errors.otp}
                              value={digit}
                              onChange={handleOtpBoxChange(index)}
                              onKeyDown={handleOtpKeyDown(index)}
                              className="h-[52px] w-full min-w-0 rounded-2xl border border-border bg-input-bg text-center font-poppins text-xl font-bold text-text-primary outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary)_16%,transparent)]"
                            />
                          ))}
                        </div>
                        {errors.otp && (
                          <p className="ml-1 text-xs text-error" role="alert">
                            {errors.otp.message as string}
                          </p>
                        )}
                        <div className="pt-1 text-center font-inter text-xs text-text-secondary">
                          Didn&apos;t receive?{' '}
                          <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={resendCooldown > 0 || loading}
                            className="font-bold text-primary underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:text-text-secondary disabled:no-underline"
                          >
                            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showNameInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <FieldShell label="Name" htmlFor="name" error={errors.name?.message as string}>
                          <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className="h-[52px] flex-1 bg-transparent font-inter text-text-primary outline-none placeholder:text-text-secondary/60"
                            aria-invalid={!!errors.name}
                            {...register('name', {
                              required: showNameInput ? 'Name is required' : false,
                              minLength: { value: 2, message: 'Name must be at least 2 characters' },
                              pattern: { value: /^[A-Za-z\s]+$/, message: 'Name can contain only letters' },
                              onChange: handleNameChange,
                              setValueAs: (value: string) => value.trimStart(),
                            })}
                          />
                        </FieldShell>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      (authStep === 'phone' && !isPhoneValid) ||
                      (authStep === 'otp' && otp.length !== OTP_LENGTH) ||
                      (authStep === 'name' && name.trim().length < 2)
                    }
                    className="flex h-12 w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] font-poppins text-base font-semibold text-surface shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : showNameInput ? (
                      'Complete Registration'
                    ) : showOtpInput ? (
                      'Verify OTP'
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="staff"
                  id="panel-staff"
                  role="tabpanel"
                  aria-labelledby="tab-staff"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleStaffSubmit}
                  className="space-y-4"
                  noValidate
                >
                  <FieldShell label="Employee ID or Email" htmlFor="identifier">
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      placeholder="SG-0001 or you@quickcart.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="h-[52px] flex-1 bg-transparent font-inter text-text-primary outline-none placeholder:text-text-secondary/60"
                    />
                  </FieldShell>

                  <FieldShell label="Password" htmlFor="password">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-[52px] flex-1 bg-transparent font-inter text-text-primary outline-none placeholder:text-text-secondary/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </FieldShell>

                  <button
                    type="submit"
                    disabled={staffLoginPending || identifier.trim().length === 0 || password.length === 0}
                    className="flex h-12 w-full min-h-11 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--color-primary),var(--color-primary-dark))] font-poppins text-base font-semibold text-surface shadow-lg shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {staffLoginPending ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                  </button>

                  <p className="text-center font-inter text-[11px] text-text-secondary">
                    Credentials issued by your store admin.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="font-inter text-xs font-semibold text-text-secondary">OR</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social login */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={notReady('Face ID')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="flex h-14 w-14 min-h-11 min-w-11 items-center justify-center rounded-full border border-accent/20 bg-accent/15 text-accent transition-transform active:scale-95">
                  <ScanFace size={24} />
                </span>
                <span className="font-inter text-xs font-medium text-text-secondary">Use Face ID</span>
              </button>

              <button
                type="button"
                onClick={notReady('Google sign-in')}
                className="flex h-12 w-full min-h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-surface font-poppins text-sm font-bold text-text-primary transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                {/* Google "G" mark uses fixed brand colors per Google's brand guidelines — not themeable */}
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.68-3.87 2.68-6.62Z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z" />
                  <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z" />
                  <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          custom={0.45}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="pb-2 pt-4 text-center font-inter text-[11px] leading-relaxed text-text-secondary"
        >
          By continuing, you agree to QuickCart&apos;s
          <br />
          <button type="button" onClick={notReady('Terms of Service')} className="font-bold text-accent hover:underline">
            Terms of Service
          </button>{' '}
          &{' '}
          <button type="button" onClick={notReady('Privacy Policy')} className="font-bold text-accent hover:underline">
            Privacy Policy
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default Login;
