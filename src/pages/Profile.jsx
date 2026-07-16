import { useEffect, useState } from 'react';
import { User, CreditCard, Globe, Settings, Bell, ChevronRight, LogOut, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { signOutUser } from '../utils/firebaseAuth';
import { getUserProfile, updateLanguage, updateNotifications, deletePaymentMethod, addPaymentMethod } from '../api/userApi';
import BottomNav from '../components/BottomNav';
import ProfileImageUpload from '../components/ProfileImageUpload';

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

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      setProfileData(response.data.data.user);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    try {
      await updateLanguage(newLanguage);
      setProfileData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, language: newLanguage }
      }));
      setShowLanguageModal(false);
    } catch (err) {
      console.error('Error updating language:', err);
    }
  };

  const handleNotificationChange = async (setting, value) => {
    try {
      const updateData = {
        [setting]: value
      };
      const response = await updateNotifications(updateData);
      setProfileData(response.data.data.user);
      setShowNotificationModal(false);
    } catch (err) {
      console.error('Error updating notifications:', err);
    }
  };

  const handleDeletePayment = async (paymentMethodId) => {
    try {
      await deletePaymentMethod(paymentMethodId);
      setProfileData(prev => ({
        ...prev,
        savedPaymentMethods: prev.savedPaymentMethods.filter(m => m._id !== paymentMethodId)
      }));
    } catch (err) {
      console.error('Error deleting payment method:', err);
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const response = await addPaymentMethod(paymentData);
      setProfileData(response.data.data.user);
      setShowAddPaymentModal(false);
    } catch (err) {
      console.error('Error adding payment method:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out from Firebase:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-32">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayName = profileData?.name || authUser?.name || 'QuickCart User';
  const phoneNumber = profileData?.phoneNumber || authUser?.phoneNumber || 'No phone number';
  const loyaltyPoints = profileData?.loyaltyBalance?.points || 0;
  const validUntil = profileData?.loyaltyBalance?.validUntil ?
    new Date(profileData.loyaltyBalance.validUntil).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) :
    'N/A';
  const savedPayments = profileData?.savedPaymentMethods || [];
  const language = profileData?.preferences?.language || 'English (US)';
  const notificationsEnabled = profileData?.preferences?.notificationsEnabled ?? true;

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 pt-12 pb-8 bg-white border-b border-outline/5">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <ProfileImageUpload
              profileImage={profileData?.profileImage}
              onImageChange={(imageData) => setProfileData(prev => ({
                ...prev,
                profileImage: imageData,
              }))}
            />
          </div>
          {!profileData?.profileImage?.url && (
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-6 border border-primary/20">
              <User size={48} className="text-primary" strokeWidth={1.5} />
            </div>
          )}
          <h1 className="text-on-surface font-poppins font-bold text-3xl tracking-tight">{displayName}</h1>
          <p className="text-secondary font-inter text-sm mt-1">{phoneNumber}</p>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <div className="mx-6 mt-8 bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-white/70 font-inter text-xs font-bold tracking-[0.2em] uppercase">Loyalty Balance</p>
              <h2 className="text-white font-poppins font-bold text-3xl mt-2">{loyaltyPoints.toLocaleString()} pts</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl">
              <ShoppingBag size={24} className="text-white" />
            </div>
          </div>
          <p className="text-white/80 font-inter text-[10px] mt-6 bg-white/10 w-fit px-3 py-1 rounded-full">Valid until {validUntil}</p>
        </div>

        <section className="mt-10">
          <h3 className="px-10 text-secondary font-inter font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Saved Payments</h3>
          <div className="mx-6 bg-white rounded-[2.5rem] shadow-sm border border-outline/5 overflow-hidden">
            {savedPayments.length === 0 ? (
              <div className="p-6 text-center text-secondary">
                <p className="text-sm font-inter">No saved payment methods</p>
              </div>
            ) : (
              savedPayments.map((method) => (
                <div key={method._id} className="flex items-center justify-between p-6 hover:bg-background transition-colors border-b border-outline/5 last:border-b-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-background p-3 rounded-xl text-on-surface">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-on-surface font-poppins font-bold text-sm">•••• {method.cardLast4}</p>
                      <p className="text-secondary font-inter text-[10px]">Expires {method.expiryDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePayment(method._id)}
                    className="text-outline hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="w-full py-4 text-primary font-inter font-bold text-xs hover:bg-background transition-colors border-t border-outline/5">
              + Add New Payment Method
            </button>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="px-10 text-secondary font-inter font-bold text-[10px] uppercase tracking-[0.2em] mb-4">Account Settings</h3>
          <div className="mx-6 bg-white rounded-[2.5rem] shadow-sm border border-outline/5 overflow-hidden">
            <MenuItem
              icon={<Globe size={20} />}
              label="Language"
              value={language}
              onClick={() => setShowLanguageModal(true)}
            />
            <MenuItem
              icon={<Bell size={20} />}
              label="Notifications"
              value={notificationsEnabled ? "Enabled" : "Disabled"}
              onClick={() => setShowNotificationModal(true)}
            />
            <MenuItem icon={<Settings size={20} />} label="Security" />
            <MenuItem
              icon={<LogOut size={20} />}
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
          <div className="space-y-3">
            {['English (US)', 'Hindi', 'Spanish', 'French'].map(lang => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full px-4 py-3 rounded-lg font-inter text-sm transition-colors ${
                  language === lang
                    ? 'bg-primary text-white'
                    : 'bg-background text-on-surface hover:bg-background/50'
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
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => handleNotificationChange('notificationsEnabled', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="font-inter text-sm text-on-surface">Enable Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData?.preferences?.emailNotifications ?? true}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="font-inter text-sm text-on-surface">Email Notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData?.preferences?.smsNotifications ?? true}
                onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                className="w-5 h-5 rounded"
              />
              <span className="font-inter text-sm text-on-surface">SMS Notifications</span>
            </label>
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
}

function MenuItem({ icon, label, value, color = "text-on-surface", showChevron = true, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 hover:bg-background transition-colors border-b border-outline/5 last:border-b-0"
    >
      <div className="flex items-center gap-4">
        <div className={`${color} bg-background p-3 rounded-xl`}>
          {icon}
        </div>
        <span className={`font-poppins font-semibold text-sm ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-secondary font-inter text-xs">{value}</span>}
        {showChevron && <ChevronRight size={18} className="text-outline" />}
      </div>
    </button>
  );
}

function Modal({ onClose, title, children }) {
  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="modal-content bg-white w-full rounded-t-[2.5rem] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-on-surface font-poppins font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AddPaymentModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    cardLast4: '',
    expiryDate: '',
    cardholderName: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'cardLast4') {
      newValue = newValue.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-on-surface font-inter text-sm font-bold mb-2">
            Card Last 4 Digits
          </label>
          <input
            type="text"
            name="cardLast4"
            placeholder="3456"
            value={formData.cardLast4}
            onChange={handleInputChange}
            inputMode="numeric"
            className="w-full px-4 py-3 border border-outline/20 rounded-lg font-inter text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-secondary font-inter text-[10px] mt-1">For security, we only store last 4 digits</p>
        </div>

        <div>
          <label className="block text-on-surface font-inter text-sm font-bold mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardholderName"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-outline/20 rounded-lg font-inter text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-on-surface font-inter text-sm font-bold mb-2">
            Expiry Date (MM/YY)
          </label>
          <input
            type="text"
            name="expiryDate"
            placeholder="12/26"
            value={formData.expiryDate}
            onChange={handleInputChange}
            maxLength="5"
            className="w-full px-4 py-3 border border-outline/20 rounded-lg font-inter text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="w-5 h-5 rounded"
          />
          <span className="font-inter text-sm text-on-surface">Set as default payment method</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-6 bg-primary text-white font-poppins font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Payment Method'}
        </button>
      </form>
    </Modal>
  );
}
