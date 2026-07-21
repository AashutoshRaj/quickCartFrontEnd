import { useState } from 'react';
import {
  Store, CreditCard, Plug, Shield, Clock, Key, Database, ChevronRight, Check, Eye, EyeOff
} from 'lucide-react';

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

export function SettingsPage() {
  const [active, setActive] = useState('store');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: 'QuickCart Flagship Store',
    email: 'admin@quickcart.com',
    phone: '+1 555-0100',
    address: '1420 Main Street, San Francisco, CA 94102',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
  });
  const [hours, setHours] = useState(
    days.map(d => ({ day: d, open: d !== 'Sunday', from: '08:00', to: '21:00' }))
  );

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Store Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Store Name', key: 'name' },
                  { label: 'Email Address', key: 'email' },
                  { label: 'Phone Number', key: 'phone' },
                  { label: 'Currency', key: 'currency' },
                  { label: 'Timezone', key: 'timezone' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                    <input
                      value={(storeForm as any)[f.key]}
                      onChange={e => setStoreForm({ ...storeForm, [f.key]: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Address</label>
                  <input
                    value={storeForm.address}
                    onChange={e => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                  {saved && <Check className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </div>
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
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>Stripe Configuration</p>
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Publishable Key</label>
                    <input defaultValue="pk_live_..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Secret Key</label>
                    <div className="relative">
                      <input type={showKey ? 'text' : 'password'} defaultValue="sk_live_••••••••••••••••" className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 font-mono" />
                      <button onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tax */}
          {active === 'tax' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Tax Configuration</h3>
              <div className="space-y-3">
                {[
                  { category: 'Fresh Produce', rate: '0%', exempt: true },
                  { category: 'Dairy & Eggs', rate: '0%', exempt: true },
                  { category: 'Meat & Seafood', rate: '0%', exempt: true },
                  { category: 'Bakery', rate: '0%', exempt: true },
                  { category: 'Beverages', rate: '8.5%', exempt: false },
                  { category: 'Snacks & Confectionery', rate: '8.5%', exempt: false },
                  { category: 'Alcohol', rate: '10%', exempt: false },
                  { category: 'Tobacco', rate: '15%', exempt: false },
                ].map(t => (
                  <div key={t.category} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{t.category}</p>
                      {t.exempt && <p className="text-xs text-green-600">Tax exempt</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <input defaultValue={t.rate} className="w-20 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg outline-none focus:border-green-400" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                {saved && <Check className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Tax Settings'}
              </button>
            </div>
          )}

          {/* Business Hours */}
          {active === 'hours' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Business Hours</h3>
              <div className="space-y-2">
                {hours.map((h, i) => (
                  <div key={h.day} className="flex items-center gap-4 py-2.5 border-b border-gray-50">
                    <span className="w-28 text-sm text-gray-700" style={{ fontWeight: 500 }}>{h.day}</span>
                    <div className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${h.open ? 'bg-green-500' : 'bg-gray-200'}`}
                      onClick={() => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, open: !x.open } : x))}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${h.open ? 'translate-x-4.5' : 'translate-x-0.5'}`} style={{ transform: h.open ? 'translateX(20px)' : 'translateX(2px)' }} />
                    </div>
                    {h.open ? (
                      <div className="flex items-center gap-2">
                        <input type="time" value={h.from} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, from: e.target.value } : x))} className="px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400" />
                        <span className="text-gray-400 text-sm">to</span>
                        <input type="time" value={h.to} onChange={e => setHours(hrs => hrs.map((x, j) => j === i ? { ...x, to: e.target.value } : x))} className="px-2 py-1 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400" />
                      </div>
                    ) : <span className="text-sm text-gray-400">Closed</span>}
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2">
                {saved && <Check className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Hours'}
              </button>
            </div>
          )}

          {/* Integrations */}
          {active === 'integrations' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Integrations</h3>
              <div className="grid grid-cols-2 gap-3">
                {integrations.map(int => (
                  <div key={int.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{int.logo}</span>
                      <div>
                        <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{int.name}</p>
                        <p className="text-xs text-gray-400">{int.desc}</p>
                      </div>
                    </div>
                    <button className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      int.status === 'Connected'
                        ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100'
                        : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                    }`} style={{ fontWeight: 500 }}>
                      {int.status === 'Connected' ? '✓ Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {active === 'security' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Security Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin logins', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                  { label: 'IP Allowlist', desc: 'Restrict admin access to specific IP ranges', enabled: false },
                  { label: 'Audit Logging', desc: 'Log all admin actions for compliance', enabled: true },
                  { label: 'Password Expiry', desc: 'Force password reset every 90 days', enabled: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{s.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                    </div>
                    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${s.enabled ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform`} style={{ transform: s.enabled ? 'translateX(20px)' : 'translateX(2px)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-700" style={{ fontWeight: 500 }}>Danger Zone</p>
                <p className="text-xs text-red-500 mt-1">These actions are irreversible. Proceed with caution.</p>
                <div className="flex gap-3 mt-3">
                  <button className="px-4 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Reset All Settings</button>
                  <button className="px-4 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">Delete Store Data</button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys */}
          {active === 'api' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>API Keys</h3>
                <button className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">Generate New Key</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Production API Key', key: 'qc_live_sk_••••••••••••••••••••••', created: 'Jan 15, 2026', last: '5 min ago', scope: 'Full Access' },
                  { name: 'Analytics Read Key', key: 'qc_anal_sk_••••••••••••••••', created: 'Mar 2, 2026', last: '2 days ago', scope: 'Read Only' },
                  { name: 'Webhook Secret', key: 'qc_whsec_••••••••••••••', created: 'Apr 10, 2026', last: '1 hour ago', scope: 'Webhooks' },
                ].map(k => (
                  <div key={k.name} className="p-4 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{k.name}</p>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded" style={{ fontWeight: 500 }}>{k.scope}</span>
                    </div>
                    <p className="font-mono text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg mb-2">{k.key}</p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Created {k.created}</span>
                      <span>Last used {k.last}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backup */}
          {active === 'backup' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Backup & Restore</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl">
                  <Database className="w-8 h-8 text-green-500 mb-3" />
                  <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Create Backup</p>
                  <p className="text-xs text-gray-400 mt-1 mb-3">Export all store data including products, orders, and customers.</p>
                  <button className="w-full py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">Download Backup</button>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl">
                  <Database className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>Restore Data</p>
                  <p className="text-xs text-gray-400 mt-1 mb-3">Restore from a previously downloaded backup file.</p>
                  <button className="w-full py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">Upload Backup File</button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 500 }}>Backup History</p>
                <div className="space-y-2">
                  {[
                    { date: 'Jun 13, 2026 00:00', size: '284 MB', type: 'Auto' },
                    { date: 'Jun 12, 2026 00:00', size: '281 MB', type: 'Auto' },
                    { date: 'Jun 10, 2026 14:22', size: '279 MB', type: 'Manual' },
                    { date: 'Jun 7, 2026 00:00', size: '272 MB', type: 'Auto' },
                  ].map(b => (
                    <div key={b.date} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-700">{b.date}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">{b.size}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${b.type === 'Auto' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>{b.type}</span>
                        </div>
                      </div>
                      <button className="text-xs text-green-600 hover:underline">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
