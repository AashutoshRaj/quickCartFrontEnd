import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Store, CreditCard, Plug, Shield, Clock, Key, Database, ChevronRight, Check, Download, Printer, Copy, Loader, Upload, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { useInvalidateStoreProfile } from '../../../hooks/useStoreProfile';
import { getStoreProfile, updateStoreProfile, regenerateStoreQRCode } from '../../../api/storeApi';

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

interface BusinessHours {
  day: string;
  open: boolean;
  from: string;
  to: string;
}

interface StoreProfile {
  _id?: string;
  storeId?: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
  currency: string;
  timezone: string;
  logo?: string | null;
  qrCode?: string | null;
  qrGeneratedAt?: string;
  businessHours?: BusinessHours[];
  status?: 'active' | 'inactive' | 'closed';
}


// Default empty store profile
const defaultStoreProfile: StoreProfile = {
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
  businessHours: [],
};

// API Calls
const fetchStoreProfile = async (): Promise<StoreProfile> => {
  try {
    const result = await getStoreProfile();
    const store = result.store || defaultStoreProfile;
    console.log('Fetched store profile:', store);
    return store as StoreProfile;
  } catch (error: any) {
    console.error('Failed to fetch store profile:', error.message);
    return { ...defaultStoreProfile };
  }
};

const saveStoreProfileAPI = async (profile: Partial<StoreProfile>): Promise<StoreProfile> => {
  const result = await updateStoreProfile(profile);
  return result.store as StoreProfile;
};

const generateStoreQRCodeAPI = async (): Promise<StoreProfile> => {
  const result = await regenerateStoreQRCode();
  return result.store as StoreProfile;
};

export function SettingsPage() {
  const [active, setActive] = useState('store');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  const invalidateStoreProfile = useInvalidateStoreProfile();

console.log('SettingsPage rendered, active section:', active);
  // Fetch store profile - always enabled to ensure data is available
  const { data: storeProfile, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['storeProfile'],
    queryFn: fetchStoreProfile,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  console.log('Store Profile loaded:', storeProfile);

  // Form state - initialize with default, update when store profile loads
  const [formData, setFormData] = useState<StoreProfile>(() => {
    return { ...defaultStoreProfile };
  });

  // Initialize form with store profile when it loads
  useEffect(() => {
    if (storeProfile) {
      console.log('Setting formData with storeProfile:', {
        name: storeProfile.name,
        email: storeProfile.email,
        phoneNumber: storeProfile.phoneNumber,
      });

      const initialData: StoreProfile = {
        ...defaultStoreProfile,
        ...storeProfile,
        name: storeProfile.name || '',
        email: storeProfile.email || '',
        phoneNumber: storeProfile.phoneNumber || '',
        address: storeProfile.address || '',
      };

      console.log('Initial data to set:', initialData);
      setFormData(initialData);
      setHasChanges(false);
      setLogoPreview(storeProfile.logo || null);
    }
  }, [storeProfile]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: saveStoreProfileAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(['storeProfile'], data);
      setFormData(data);
      setHasChanges(false);
      setLogoPreview(data.logo || null);
      // Invalidate cache to trigger refetch in Header & Sidebar
      invalidateStoreProfile();
      toast.success('Store profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save store profile');
    },
  });

  // Generate QR mutation
  const qrMutation = useMutation({
    mutationFn: generateStoreQRCodeAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(['storeProfile'], data);
      setFormData(data);
      invalidateStoreProfile();
      toast.success('QR code generated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate QR code');
    },
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  // Handle logo upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogoPreview(dataUrl);
        setFormData(prev => ({
          ...prev,
          logo: dataUrl,
        }));
        setHasChanges(true);
      };
      reader.onerror = () => {
        toast.error('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name?.trim()) {
      errors.push('Store name is required');
    }
    if (!formData.address?.trim()) {
      errors.push('Address is required');
    }
    if (!formData.phoneNumber?.trim()) {
      errors.push('Phone number is required');
    }
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    }

    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return false;
    }
    return true;
  };

  // Handle save
  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    const dataToSave: Partial<StoreProfile> = {
      ...formData,
    };

    // Remove _id and storeId to avoid conflicts
    delete dataToSave._id;
    delete dataToSave.storeId;

    saveMutation.mutate(dataToSave);
  };

  // Handle QR generation
  const handleGenerateQR = () => {
    if (!formData._id) {
      toast.error('Please save store profile first');
      return;
    }
    qrMutation.mutate();
  };

  // Handle QR download
  const handleDownloadQR = (format: 'png' | 'svg') => {
    if (!formData.qrCode) {
      toast.error('No QR code to download');
      return;
    }
    const link = document.createElement('a');
    link.href = formData.qrCode;
    link.download = `${formData.name}-qr-code.${format}`;
    link.click();
    toast.success(`QR code downloaded as ${format.toUpperCase()}`);
  };

  // Handle QR print
  const handlePrintQR = () => {
    if (!formData.qrCode) {
      toast.error('No QR code to print');
      return;
    }
    const printWindow = window.open('', '', 'width=600,height=700');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Code - ${formData.name}</title>
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
              <h1>${formData.name}</h1>
              <p>Scan this QR Code to visit our store</p>
              <img src="${formData.qrCode}" alt="Store QR Code" />
              <p style="font-size: 12px; margin-top: 30px;">https://quickcart.app/store/${formData._id}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success('Print dialog opened');
    }
  };

  // Handle copy link
  const handleCopyLink = () => {
    if (!formData._id) {
      toast.error('Store profile not saved yet');
      return;
    }
    const link = `https://quickcart.app/store/${formData._id}`;
    navigator.clipboard.writeText(link);
    toast.success('Store link copied to clipboard');
  };

  const isLoading = storeLoading;
  const isSaving = saveMutation.isPending;
  const isGeneratingQR = qrMutation.isPending;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store configuration and preferences</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar Navigation */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
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

        {/* Main Content */}
        <div className="flex-1">
          {/* Store Profile Section */}
          {active === 'store' && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-96 bg-white rounded-xl border border-gray-100">
                  <div className="flex flex-col items-center gap-3">
                    <Loader className="w-8 h-8 animate-spin text-green-500" />
                    <p className="text-gray-600">Loading store profile...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Unsaved Changes Warning */}
                  {hasChanges && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Unsaved changes</p>
                        <p className="text-xs text-yellow-700 mt-1">You have unsaved changes. Click Save Changes to persist your edits.</p>
                      </div>
                    </div>
                  )}

                  {/* Store Profile Form */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-gray-900 text-lg" style={{ fontWeight: 600 }}>Store Information</h3>
                      <p className="text-xs text-gray-500 mt-1">Update your store details and contact information</p>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-700">Basic Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Store Name */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>
                            Store Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., John's Retail Store"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* Email - Read Only */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            disabled
                            placeholder="your@email.com"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-400 mt-1.5">Set during account creation. Contact support to change.</p>
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="e.g., +1 (555) 123-4567"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* Currency */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>Currency</label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          >
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="AUD">AUD - Australian Dollar</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                          </select>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>Timezone</label>
                          <input
                            type="text"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            placeholder="e.g., America/New_York"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* Store Status */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>Status</label>
                          <select
                            name="status"
                            value={formData.status || 'active'}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">Address</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Address */}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>
                            Street Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="123 Main Street"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* City */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            onChange={handleInputChange}
                            placeholder="NY"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>Country</label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            onChange={handleInputChange}
                            placeholder="United States"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>

                        {/* Postal Code */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-2" style={{ fontWeight: 500 }}>Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode || ''}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Store Description */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">Store Description</h4>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        placeholder="Tell customers about your store, what you sell, and why they should shop with you..."
                        rows={4}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition resize-none"
                      />
                      <p className="text-xs text-gray-400">Optional. Displayed to customers when they scan your QR code.</p>
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700">Store Logo</h4>
                      <div className="flex gap-6">
                        <div className="flex-1">
                          <label className="flex flex-col items-center justify-center gap-3 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-gray-700">Click to upload logo</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {(logoPreview || formData.logo) && (
                          <div className="w-32 h-32 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img
                              src={logoPreview || formData.logo || ''}
                              alt="Store logo"
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving || !hasChanges}
                        className={`px-6 py-2.5 text-white text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
                          isSaving || !hasChanges
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 active:scale-95'
                        }`}
                      >
                        {isSaving && <Loader className="w-4 h-4 animate-spin" />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      {hasChanges && (
                        <p className="text-xs text-yellow-600 ml-2">Press Save to persist your changes</p>
                      )}
                    </div>
                  </div>

                  {/* QR Code Section */}
                  {formData._id && (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-gray-900 text-lg" style={{ fontWeight: 600 }}>Store QR Code</h3>
                          <p className="text-xs text-gray-500 mt-1">QR code for customers to scan and access your store</p>
                        </div>
                        {formData.qrCode && formData.qrGeneratedAt && (
                          <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                            Generated {new Date(formData.qrGeneratedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {formData.qrCode ? (
                        <div className="space-y-5">
                          {/* QR Display */}
                          <div className="flex flex-col items-center bg-gray-50 p-8 rounded-lg border border-gray-200">
                            <div className="bg-white p-4 rounded shadow-sm">
                              <QRCodeSVG
                                value={`https://quickcart.app/store/${formData._id}`}
                                size={200}
                                level="H"
                                fgColor="#000000"
                                bgColor="#FFFFFF"
                              />
                            </div>
                            <p className="text-sm text-gray-600 mt-6">Store ID: <span className="font-mono font-semibold">{formData._id}</span></p>
                          </div>

                          {/* Store Link */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600 mb-2 font-medium">Store Public Link</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono text-gray-900 flex-1 break-all">https://quickcart.app/store/{formData._id}</p>
                              <button
                                onClick={handleCopyLink}
                                className="p-2 hover:bg-white rounded transition"
                                title="Copy link"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* QR Actions */}
                          <div className="grid grid-cols-4 gap-3">
                            <button
                              onClick={() => handleDownloadQR('png')}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition font-medium"
                            >
                              <Download size={16} />
                              <span>PNG</span>
                            </button>
                            <button
                              onClick={() => handleDownloadQR('svg')}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition font-medium"
                            >
                              <Download size={16} />
                              <span>SVG</span>
                            </button>
                            <button
                              onClick={handlePrintQR}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition font-medium"
                            >
                              <Printer size={16} />
                              <span>Print</span>
                            </button>
                            <button
                              onClick={handleCopyLink}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition font-medium"
                            >
                              <Copy size={16} />
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-600 font-medium mb-4">No QR Code Generated</p>
                          <p className="text-sm text-gray-500 mb-6">Generate a QR code for customers to scan and access your store information</p>
                          <button
                            onClick={handleGenerateQR}
                            disabled={isGeneratingQR}
                            className={`px-6 py-2.5 text-white text-sm rounded-lg font-medium transition-all flex items-center gap-2 mx-auto ${
                              isGeneratingQR
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 active:scale-95'
                            }`}
                          >
                            {isGeneratingQR && <Loader className="w-4 h-4 animate-spin" />}
                            {isGeneratingQR ? 'Generating...' : 'Generate QR Code'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Payment Methods */}
          {active === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900 text-lg" style={{ fontWeight: 600 }}>Payment Methods</h3>
              <div className="space-y-3">
                {[
                  { name: 'Stripe', desc: 'Credit & debit card processing', enabled: true, badge: 'Primary' },
                  { name: 'Cash', desc: 'Cash payments at checkout', enabled: true, badge: null },
                  { name: 'Apple Pay', desc: 'Contactless mobile payment', enabled: true, badge: null },
                  { name: 'Google Pay', desc: 'Android contactless payment', enabled: false, badge: null },
                  { name: 'Klarna', desc: 'Buy now, pay later', enabled: false, badge: null },
                ].map(pm => (
                  <div key={pm.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-800 font-medium">{pm.name}</p>
                        {pm.badge && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">{pm.badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{pm.desc}</p>
                    </div>
                    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${pm.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${pm.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon */}
          {active !== 'store' && active !== 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 shadow-sm text-center">
              <p className="text-gray-600 font-medium">Coming soon...</p>
              <p className="text-sm text-gray-500 mt-2">This section is under development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
