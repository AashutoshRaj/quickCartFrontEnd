import { useState, useEffect } from 'react';
import {
  Store, CreditCard, Plug, Shield, Clock, Key, Database, ChevronRight, Check, Eye, EyeOff, Download, Printer, Copy, RotateCw, Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';

const sections = [
  { id: 'store', label: 'Store Profile', icon: Store },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'tax', label: 'Tax Configuration', icon: ChevronRight },
  { id: 'hours', label: 'Business Hours', icon: Clock },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'backup', label: 'Backup & Restore', icon: Database },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const integrations = [
  { name: 'Stripe', desc: 'Payment processing', status: 'Connected', logo: '💳', color: 'text-indigo-600' },
  { name: 'Shopify POS', desc: 'Point of sale sync', status: 'Not Connected', logo: '🛍️', color: 'text-gray-400' },
  { name: 'QuickBooks', desc: 'Accounting & finance', status: 'Connected', logo: '📊', color: 'text-green-600' },
  { name: 'Mailchimp', desc: 'Email marketing', status: 'Connected', logo: '📧', color: 'text-yellow-600' },
  { name: 'Twilio', desc: 'SMS campaigns', status: 'Connected', logo: '📱', color: 'text-red-500' },
  { name: 'Firebase', desc: 'Push notifications', status: 'Not Connected', logo: '🔥', color: 'text-gray-400' },
];

interface StoreProfile {
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  description: string;
  currency: string;
  timezone: string;
  logo?: string;
  qrCode?: string;
  qrGeneratedAt?: string;
}

export function SettingsPage() {
  const [active, setActive] = useState('store');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [saved, setSaved] = useState(false);

  // Store Profile State
  const [storeProfile, setStoreProfile] = useState<StoreProfile>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    description: '',
    currency: 'USD',
    timezone: 'UTC',
  });

  const [formData, setFormData] = useState<StoreProfile>(storeProfile);
  const [hours] = useState(
    days.map(d => ({ day: d, open: d !== 'Sunday', from: '08:00', to: '21:00' }))
  );

  // Fetch user data and store profile on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data for auto-population
        const userResponse = await fetch('/api/v1/users/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.data?.user || userData.user || userData;

          console.log('User data fetched:', user);

          // Auto-populate with user signup data
          const userEmail = user.email || user.emailAddress || '';
          const userPhone = user.phone || user.phoneNumber || user.mobileNumber || '';
          const userName = user.name || user.fullName || user.firstName || '';

          console.log('Extracted - Name:', userName, 'Email:', userEmail, 'Phone:', userPhone);

          setFormData(prev => ({
            ...prev,
            name: prev.name || userName,
            email: userEmail,
            phoneNumber: prev.phoneNumber || userPhone,
          }));
        } else {
          console.warn('Failed to fetch user data. Status:', userResponse.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      try {
        // Fetch store profile
        const storeResponse = await fetch('/api/v1/stores/profile');

        // Handle 404 - no profile exists yet
        if (storeResponse.status === 404) {
          console.log('No store profile found. Starting fresh.');
          return;
        }

        if (!storeResponse.ok) {
          console.error(`HTTP error! status: ${storeResponse.status}`);
          return;
        }

        // Parse JSON response safely
        const text = await storeResponse.text();
        if (!text) {
          console.log('Empty response - no profile exists');
          return;
        }

        const data = JSON.parse(text);
        const profileData = data.data?.store || data.store || data;

        if (profileData && profileData._id) {
          setStoreProfile(profileData);
          setFormData(profileData);
        }
      } catch (error) {
        console.error('Error fetching store profile:', error);
        // Silently fail - form remains empty for new profile
      }
    };

    if (active === 'store') {
      fetchData();
    }
  }, [active]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`Form field changed: ${name} = ${value}`);
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log('Updated formData:', updated);
      return updated;
    });
  };

  const handleSaveProfile = async () => {
    console.log('Save clicked. FormData:', formData);

    // Validate required fields
    if (!formData.name?.trim()) {
      console.error('Name is empty');
      toast.error('Store name is required');
      return;
    }
    if (!formData.address?.trim()) {
      console.error('Address is empty');
      toast.error('Address is required');
      return;
    }

    // Email and phone auto-populated from user data, required but read-only
    if (!formData.email?.trim()) {
      console.error('Email is empty - user data not loaded?');
      toast.error('Email is required (should be auto-filled from signup)');
      return;
    }
    if (!formData.phoneNumber?.trim()) {
      console.error('PhoneNumber is empty - user data not loaded?');
      toast.error('Phone number is required (should be auto-filled from signup)');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Sending to backend:', JSON.stringify(formData, null, 2));

      // Call backend API to save store profile
      const response = await fetch('/api/v1/stores/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);

      // Parse response text first
      const text = await response.text();
      console.log('Response text:', text.substring(0, 200));

      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      console.log('Parsed response:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      const savedProfile = data.data?.store || data.store || data;
      console.log('Saved profile:', savedProfile);

      if (!savedProfile || !savedProfile._id) {
        throw new Error('Invalid response format - missing store data');
      }

      setStoreProfile(savedProfile);
      setFormData(savedProfile);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success('Store profile saved successfully');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save store profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!storeProfile._id) {
      toast.error('Please save store profile first');
      return;
    }

    setIsGeneratingQR(true);
    try {
      // Call backend API to generate QR code
      const response = await fetch('/api/v1/stores/profile/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Parse response text first
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      const updatedProfile = data.data?.store || data.store || data;

      if (!updatedProfile || !updatedProfile.qrCode) {
        throw new Error('Invalid response - QR code not generated');
      }

      setStoreProfile(updatedProfile);
      toast.success('QR code generated successfully');
    } catch (error: any) {
      console.error('QR generation error:', error);
      toast.error(error.message || 'Failed to generate QR code');
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = (format: 'png' | 'svg') => {
    if (!storeProfile.qrCode) {
      toast.error('No QR code to download');
      return;
    }

    try {
      const storeLink = `https://quickcart.app/store/${storeProfile._id}`;
      const filename = `${storeProfile.name}-qr-code.${format}`;

      // Create download link
      const link = document.createElement('a');
      link.href = storeProfile.qrCode;
      link.download = filename;
      link.click();

      toast.success(`QR code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download QR code');
    }
  };

  const handlePrintQR = () => {
    if (!storeProfile.qrCode) {
      toast.error('No QR code to print');
      return;
    }

    try {
      const printWindow = window.open('', '', 'width=600,height=700');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Code - ${storeProfile.name}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 40px;
                  margin: 0;
                }
                .container { text-align: center; }
                h1 { margin-bottom: 10px; font-size: 24px; }
                p { margin: 5px 0; color: #666; }
                img { margin: 30px 0; border: 2px solid #ddd; padding: 10px; max-width: 400px; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${storeProfile.name}</h1>
                <p>Scan this QR Code to visit our store</p>
                <img src="${storeProfile.qrCode}" alt="Store QR Code" />
                <p style="font-size: 12px; margin-top: 30px;">https://quickcart.app/store/${storeProfile._id}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        toast.success('Print dialog opened');
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print QR code');
    }
  };

  const handleCopyLink = () => {
    const storeLink = `https://quickcart.app/store/${storeProfile._id}`;
    navigator.clipboard.writeText(storeLink);
    toast.success('Store link copied to clipboard');
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store configuration and preferences</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-gray-50 last:border-b-0 ${
                  active === s.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{ fontWeight: active === s.id ? 500 : 400 }}
              >
                <s.icon className="w-4 h-4 flex-shrink-0" />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Store Profile */}
          {active === 'store' && (
            <div className="space-y-6">
              {/* Store Profile Form */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Store Profile</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Store Name */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Store Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter store name"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  {/* Email - Read-only from signup */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                      Email Address (from signup - read-only)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      disabled
                      placeholder="Loading email from account..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                    />
                    <p className="text-xs text-gray-400 mt-1">This is the email you used when signing up. Cannot be changed.</p>
                  </div>

                  {/* Phone - Read-only from signup */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                      Phone Number (from signup - read-only)
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber || ''}
                      disabled
                      placeholder="Loading phone from account..."
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                    />
                    <p className="text-xs text-gray-400 mt-1">This is the phone number you provided during signup. Cannot be changed.</p>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>INR</option>
                      <option>JPY</option>
                      <option>AUD</option>
                      <option>CAD</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Timezone</label>
                    <input
                      type="text"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      placeholder="e.g., America/Los_Angeles"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  {/* City, State, Country, Postal Code */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Postal code"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Store Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter store description (optional)"
                      rows={3}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                    {saved && <Check className="w-4 h-4" />}
                    {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* QR Code Section - Only show if profile saved */}
              {storeProfile._id && (
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Store QR Code</h3>
                    {storeProfile.qrCode && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded" style={{ fontWeight: 500 }}>
                        Generated {new Date(storeProfile.qrGeneratedAt || '').toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {storeProfile.qrCode ? (
                    <div className="space-y-5">
                      {/* QR Display */}
                      <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="bg-white p-4 rounded">
                          <QRCodeSVG
                            value={`https://quickcart.app/store/${storeProfile._id}`}
                            size={200}
                            level="H"
                            includeMargin
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-4 text-center">Store ID: {storeProfile._id}</p>
                      </div>

                      {/* Store Link */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">Store Link:</p>
                        <p className="text-sm font-mono text-gray-900 break-all">https://quickcart.app/store/{storeProfile._id}</p>
                      </div>

                      {/* QR Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleDownloadQR('png')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
                        >
                          <Download size={16} />
                          <span>PNG</span>
                        </button>
                        <button
                          onClick={() => handleDownloadQR('svg')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition"
                        >
                          <Download size={16} />
                          <span>SVG</span>
                        </button>
                        <button
                          onClick={handlePrintQR}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
                        >
                          <Printer size={16} />
                          <span>Print</span>
                        </button>
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition"
                        >
                          <Copy size={16} />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">No QR code generated yet</p>
                      <button
                        onClick={handleGenerateQR}
                        disabled={isGeneratingQR || !storeProfile._id}
                        className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm rounded-lg transition flex items-center gap-2 mx-auto"
                      >
                        {isGeneratingQR && <Loader className="w-4 h-4 animate-spin" />}
                        {isGeneratingQR ? 'Generating...' : 'Generate Store QR Code'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Payment Methods */}
          {active === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Payment Methods</h3>
              <div className="space-y-3">
                {[
                  { name: 'Stripe', desc: 'Credit & debit card processing', enabled: true, badge: 'Primary' },
                  { name: 'Cash', desc: 'Cash payments at checkout', enabled: true, badge: null },
                  { name: 'Apple Pay', desc: 'Contactless mobile payment', enabled: true, badge: null },
                  { name: 'Google Pay', desc: 'Android contactless payment', enabled: false, badge: null },
                  { name: 'Klarna', desc: 'Buy now, pay later', enabled: false, badge: null },
                ].map(pm => (
                  <div key={pm.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{pm.name}</p>
                        {pm.badge && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded" style={{ fontWeight: 500 }}>{pm.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{pm.desc}</p>
                    </div>
                    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${pm.enabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pm.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {active !== 'store' && active !== 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <p className="text-gray-600">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
