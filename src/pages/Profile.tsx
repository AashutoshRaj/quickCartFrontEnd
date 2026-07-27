import React, { useEffect, useState } from 'react';
import { CreditCard, Globe, Settings, Bell, ChevronRight, LogOut, ShoppingBag, X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, UserProfile, ProfileImage } from '../types/index';
import { PATHS } from '../app/paths';
import { logout } from '../store/slices/authSlice.ts';
import { signOutUser } from '../utils/firebaseAuth.ts';
import { getUserProfile, updateLanguage, updateNotifications, deletePaymentMethod, addPaymentMethod } from '../api/userApi.ts';
import BottomNav from '../components/BottomNav.tsx';
import ProfileImageUpload from '../components/ProfileImageUpload.tsx';

const SOFT_SHADOW = 'shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_30px_rgba(15,23,42,0.08)]';
const SOFT_SHADOW_HOVER = 'hover:shadow-[0_4px_12px_rgba(15,23,42,0.06),0_16px_40px_rgba(15,23,42,0.10)]';

interface PaymentMethod {
  _id: string;
  cardLast4: string;
  expiryDate: string;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  color?: string;
  showChevron?: boolean;
  onClick?: () => void;
}

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

interface PaymentFormData {
  cardLast4: string;
  expiryDate: string;
  cardholderName: string;
  isDefault: boolean;
}

interface AddPaymentModalProps {
  onClose: () => void;
  onAdd: (formData: PaymentFormData) => Promise<void>;
}

const MODAL_STYLES = `
  @keyframes slideUpIn {
    from {
      opacity: 0;
      transform: translateY(100px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-backdrop {
    animation: fadeIn 0.3s ease-out;
  }

  .modal-content {
    animation: slideUpIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = MODAL_STYLES;
  document.head.appendChild(style);
}

/**
 * Profile Page Component
 * Displays user profile with loyalty points, payment methods, and account settings
 * Handles language, notification preferences, and payment method management
 *
 * @returns {React.ReactElement} User profile page
 */
const Profile: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfileData(response.data?.user ?? response.data?.data?.user ?? null);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string): Promise<void> => {
    try {
      await updateLanguage(newLanguage);
      setProfileData((prev) => prev ? {
        ...prev,
        preferences: { ...prev.preferences, language: newLanguage }
      } : null);
      setShowLanguageModal(false);
    } catch (err) {
      console.error('Error updating language:', err);
    }
  };

  const handleNotificationChange = async (setting: string, value: boolean): Promise<void> => {
    try {
      const updateData: Record<string, boolean> = {
        [setting]: value
      };
      const response = await updateNotifications(updateData);
      setProfileData(response.data?.user ?? response.data?.data?.user ?? null);
      setShowNotificationModal(false);
    } catch (err) {
      console.error('Error updating notifications:', err);
    }
  };

  const handleDeletePayment = async (paymentMethodId: string): Promise<void> => {
    try {
      await deletePaymentMethod(paymentMethodId);
      setProfileData((prev) => prev ? {
        ...prev,
        savedPaymentMethods: (prev.savedPaymentMethods ?? []).filter(m => m._id !== paymentMethodId)
      } : null);
    } catch (err) {
      console.error('Error deleting payment method:', err);
    }
  };

  const handleAddPayment = async (paymentData: PaymentFormData): Promise<void> => {
    try {
      const response = await addPaymentMethod(paymentData);
      setProfileData(response.data?.user ?? response.data?.data?.user ?? null);
      setShowAddPaymentModal(false);
    } catch (err) {
      console.error('Error adding payment method:', err);
    }
  };

  const handleSignOut = async (e?: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e?.preventDefault();
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    } finally {
      dispatch(logout());
      navigate(PATHS.LOGIN);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-32 px-6">
        <div className={`bg-white rounded-[24px] p-10 text-center ${SOFT_SHADOW}`}>
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-primary/20 border-t-primary mx-auto mb-4"></div>
          <p className="text-secondary font-inter text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-32 px-6">
        <div className={`bg-white rounded-[24px] p-10 text-center ${SOFT_SHADOW}`}>
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-500" size={26} />
          </div>
          <p className="text-on-surface font-poppins font-bold text-sm mb-1">Failed to Load Profile</p>
          <p className="text-secondary font-inter text-xs mb-5">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-6 py-2.5 bg-gradient-to-br from-primary to-[#FF9F1C] text-white rounded-[16px] font-inter font-semibold text-sm shadow-[0_8px_20px_rgba(255,184,0,0.3)] active:scale-95 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = profileData?.name || (authUser as any)?.name || 'QuickCart User';
  const phoneNumber = profileData?.phoneNumber || (authUser as any)?.phoneNumber || 'No phone number';
  const loyaltyPoints = profileData?.loyaltyBalance?.points || 0;
  const validUntil = profileData?.loyaltyBalance?.validUntil ?
    new Date(profileData.loyaltyBalance.validUntil).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
    'N/A';
  const savedPayments = profileData?.savedPaymentMethods || [];
  const language = profileData?.preferences?.language || 'English (US)';
  const notificationsEnabled = profileData?.preferences?.notificationsEnabled ?? true;

  const handleImageChange = (imageData: ProfileImage | undefined): void => {
    setProfileData((prev) => {
      if (!prev) return null;
      const { profileImage: _profileImage, ...rest } = prev;
      return imageData ? { ...rest, profileImage: imageData } : rest;
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 pt-10 pb-8 bg-white rounded-b-[32px] shadow-[0_1px_0_rgba(15,23,42,0.04),0_16px_36px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5">
            <ProfileImageUpload
              profileImage={profileData?.profileImage}
              onImageChange={handleImageChange}
            />
          </div>
          <h1 className="text-on-surface font-poppins font-bold text-2xl tracking-tight">{displayName}</h1>
          <p className="text-secondary font-inter text-sm mt-1">{phoneNumber}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mx-6 mt-6 bg-gradient-to-br from-primary via-[#FFC12E] to-[#FF9F1C] p-6 rounded-[24px] shadow-[0_8px_20px_rgba(255,184,0,0.18),0_20px_45px_rgba(255,184,0,0.28)] relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex justify-between items-center">
            <div>
              <p className="text-white/80 font-inter text-[11px] font-semibold tracking-[0.2em] uppercase">Loyalty Balance</p>
              <h2 className="text-white font-poppins font-bold text-3xl mt-1.5">{loyaltyPoints.toLocaleString()} pts</h2>
            </div>
            <div className="bg-white/20 p-3.5 rounded-2xl">
              <ShoppingBag size={24} className="text-white" />
            </div>
          </div>
          <p className="relative text-white/85 font-inter text-[11px] mt-5 bg-white/15 w-fit px-3 py-1.5 rounded-full">Valid until {validUntil}</p>
        </motion.div>

        <section className="mt-8">
          <h3 className="px-6 text-secondary font-inter font-bold text-[11px] uppercase tracking-[0.15em] mb-3">Saved Payments</h3>
          <div className={`mx-6 bg-white rounded-[24px] ${SOFT_SHADOW} overflow-hidden`}>
            {savedPayments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-inter text-secondary">No saved payment methods</p>
              </div>
            ) : (
              savedPayments.map((method: PaymentMethod) => (
                <div key={method._id} className="flex items-center justify-between p-5 border-b border-outline/5 last:border-b-0">
                  <div className="flex items-center gap-3.5">
                    <div className="bg-primary/10 p-3 rounded-[14px] text-primary">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-on-surface font-poppins font-bold text-sm">•••• {method.cardLast4}</p>
                      <p className="text-secondary font-inter text-[11px] mt-0.5">Expires {method.expiryDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePayment(method._id)}
                    className="p-2 text-outline hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="w-full py-4 text-primary font-inter font-bold text-xs active:bg-background transition-colors duration-150 border-t border-outline/5">
              + Add New Payment Method
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="px-6 text-secondary font-inter font-bold text-[11px] uppercase tracking-[0.15em] mb-3">Account Settings</h3>
          <div className={`mx-6 bg-white rounded-[24px] ${SOFT_SHADOW} overflow-hidden`}>
            <MenuItem
              icon={<Globe size={19} />}
              label="Language"
              value={language}
              onClick={() => setShowLanguageModal(true)}
            />
            <MenuItem
              icon={<Bell size={19} />}
              label="Notifications"
              value={notificationsEnabled ? "Enabled" : "Disabled"}
              onClick={() => setShowNotificationModal(true)}
            />
            <MenuItem icon={<Settings size={19} />} label="Security" />
            <MenuItem
              icon={<LogOut size={19} />}
              label="Sign Out"
              color="text-red-500"
              showChevron={false}
              onClick={handleSignOut}
            />
          </div>
        </section>
      </main>

      {showLanguageModal && (
        <Modal onClose={() => setShowLanguageModal(false)} title="Select Language">
          <div className="space-y-2.5">
            {['English (US)', 'Hindi', 'Spanish', 'French'].map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full px-4 py-3.5 rounded-[16px] font-inter text-sm font-medium text-left transition-colors duration-150 ${
                  language === lang
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'bg-background text-on-surface active:bg-background/70'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {showNotificationModal && (
        <Modal onClose={() => setShowNotificationModal(false)} title="Notification Settings">
          <div className="space-y-1">
            <ToggleRow
              label="Enable Notifications"
              checked={notificationsEnabled}
              onChange={(checked) => handleNotificationChange('notificationsEnabled', checked)}
            />
            <ToggleRow
              label="Email Notifications"
              checked={profileData?.preferences?.emailNotifications ?? true}
              onChange={(checked) => handleNotificationChange('emailNotifications', checked)}
            />
            <ToggleRow
              label="SMS Notifications"
              checked={profileData?.preferences?.smsNotifications ?? true}
              onChange={(checked) => handleNotificationChange('smsNotifications', checked)}
            />
          </div>
        </Modal>
      )}

      {showAddPaymentModal && (
        <AddPaymentModal
          onClose={() => setShowAddPaymentModal(false)}
          onAdd={handleAddPayment}
        />
      )}

      <BottomNav />
    </div>
  );
};

/**
 * Menu Item Component
 * Displays menu item with icon and optional value
 *
 * @param {MenuItemProps} props - Menu item properties
 * @returns {React.ReactElement} Menu item element
 */
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, value, color = "text-on-surface", showChevron = true, onClick }): React.ReactElement => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 active:bg-background transition-colors duration-150 border-b border-outline/5 last:border-b-0"
    >
      <div className="flex items-center gap-3.5">
        <div className={`${color} bg-background p-3 rounded-[14px]`}>
          {icon}
        </div>
        <span className={`font-poppins font-semibold text-sm ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2.5">
        {value && <span className="text-secondary font-inter text-xs">{value}</span>}
        {showChevron && <ChevronRight size={18} className="text-outline" />}
      </div>
    </button>
  );
};

/**
 * Toggle Row Component
 * Labeled row with a premium switch control, used inside the notifications modal
 *
 * @returns {React.ReactElement} Toggle row element
 */
interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, checked, onChange }): React.ReactElement => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-3.5"
    >
      <span className="font-inter text-sm text-on-surface">{label}</span>
      <span
        className={`relative w-11 rounded-full transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-outline/20'
        }`}
        style={{ height: '26px' }}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </span>
    </button>
  );
};

/**
 * Modal Component
 * Reusable modal container with backdrop and close button
 *
 * @param {ModalProps} props - Modal properties
 * @returns {React.ReactElement} Modal element
 */
const Modal: React.FC<ModalProps> = ({ onClose, title, children }): React.ReactElement => {
  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="modal-content bg-white w-full max-w-md mx-auto rounded-t-[28px] p-6 pt-3 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1.5 bg-outline/20 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-on-surface font-poppins font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-outline hover:text-on-surface hover:bg-background rounded-full transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/**
 * Add Payment Modal Component
 * Form modal for adding new payment methods
 *
 * @param {AddPaymentModalProps} props - Add payment modal properties
 * @returns {React.ReactElement} Add payment modal element
 */
const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ onClose, onAdd }): React.ReactElement => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardLast4: '',
    expiryDate: '',
    cardholderName: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    let newValue: string | boolean = type === 'checkbox' ? checked : value;

    if (name === 'cardLast4') {
      newValue = (newValue as string).replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!formData.cardLast4 || !formData.expiryDate || !formData.cardholderName) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.cardLast4.length !== 4) {
      setError('Card last 4 digits must be 4 numbers');
      return;
    }

    setLoading(true);
    try {
      await onAdd(formData);
    } catch (err) {
      setError('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Payment Method">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-[14px] text-sm font-inter">
            {error}
          </div>
        )}

        <div>
          <label className="block text-on-surface font-inter text-sm font-semibold mb-2">
            Card Last 4 Digits
          </label>
          <input
            type="text"
            name="cardLast4"
            placeholder="3456"
            value={formData.cardLast4}
            onChange={handleInputChange}
            inputMode="numeric"
            className="w-full px-4 py-3.5 bg-background rounded-[16px] font-inter text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all duration-200"
          />
          <p className="text-secondary font-inter text-[11px] mt-1.5">For security, we only store last 4 digits</p>
        </div>

        <div>
          <label className="block text-on-surface font-inter text-sm font-semibold mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardholderName"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={handleInputChange}
            className="w-full px-4 py-3.5 bg-background rounded-[16px] font-inter text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-on-surface font-inter text-sm font-semibold mb-2">
            Expiry Date (MM/YY)
          </label>
          <input
            type="text"
            name="expiryDate"
            placeholder="12/26"
            value={formData.expiryDate}
            onChange={handleInputChange}
            maxLength={5}
            className="w-full px-4 py-3.5 bg-background rounded-[16px] font-inter text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 transition-all duration-200"
          />
        </div>

        <ToggleRow
          label="Set as default payment method"
          checked={formData.isDefault}
          onChange={(checked) => setFormData((prev) => ({ ...prev, isDefault: checked }))}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-gradient-to-br from-primary to-[#FF9F1C] text-white font-poppins font-bold rounded-[16px] shadow-[0_8px_20px_rgba(255,184,0,0.3)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Payment Method'}
        </button>
      </form>
    </Modal>
  );
};

export default Profile;
