import { useState } from 'react';
import { Plus, Tag, Percent, Calendar, Trash2, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useStoreProfile } from '../../../hooks/useStoreProfile';
import { formatCurrency } from '../../../utils/currency';

const promotions = [
  { id: 'PRO-001', name: 'Summer Fresh Savings', type: 'Percentage', value: '15%', category: 'Fresh Produce', start: 'Jun 10, 2026', end: 'Jun 30, 2026', status: 'Active', used: 842, revenue: 12480 },
  { id: 'PRO-002', name: 'Dairy Double Deal', type: 'Buy X Get Y', value: 'Buy 2 Get 1', category: 'Dairy & Eggs', start: 'Jun 1, 2026', end: 'Jun 20, 2026', status: 'Active', used: 524, revenue: 8920 },
  { id: 'PRO-003', name: 'Bakery Morning Special', type: 'Fixed Amount', discountAmount: 2, category: 'Bakery', start: 'Jun 13, 2026', end: 'Jun 13, 2026', status: 'Active', used: 318, revenue: 3240 },
  { id: 'PRO-004', name: 'Seafood Weekend', type: 'Percentage', value: '20%', category: 'Meat & Seafood', start: 'May 25, 2026', end: 'Jun 8, 2026', status: 'Expired', used: 1240, revenue: 24800 },
  { id: 'PRO-005', name: 'Loyalty Member Bonus', type: 'Points Multiplier', value: '2× Points', category: 'All Products', start: 'Jun 15, 2026', end: 'Jun 22, 2026', status: 'Scheduled', used: 0, revenue: 0 },
];

const coupons = [
  { code: 'FRESH15', discountType: 'percentage', discountValue: 15, discountLabel: 'off Fresh Produce', used: 284, limit: 500, expires: 'Jun 30, 2026', status: 'Active' },
  { code: 'WELCOME10', discountType: 'fixed', discountValue: 10, discountLabel: 'off first order', used: 1840, limit: 2000, expires: 'Dec 31, 2026', status: 'Active' },
  { code: 'SUMMER25', discountType: 'threshold', thresholdValue: 100, discountLabel: 'order', used: 492, limit: 300, expires: 'Jun 20, 2026', status: 'Expired' },
  { code: 'LOYAL50', discountType: 'points', discountLabel: '50 bonus loyalty points', used: 920, limit: 1000, expires: 'Jul 31, 2026', status: 'Active' },
  { code: 'BAKERY5', discountType: 'fixed', discountValue: 5, discountLabel: 'off bakery items', used: 78, limit: 200, expires: 'Jun 15, 2026', status: 'Scheduled' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  Expired: 'bg-gray-100 text-gray-500',
  Scheduled: 'bg-blue-50 text-blue-700',
};

const formatPromotionValue = (promotion: typeof promotions[number], currency: string) => {
  if (promotion.type === 'Fixed Amount') {
    return `${formatCurrency(promotion.discountAmount || 0, currency)} off`;
  }
  return promotion.value;
};

const formatCouponDiscount = (coupon: typeof coupons[number], currency: string) => {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% ${coupon.discountLabel}`;
  }
  if (coupon.discountType === 'fixed') {
    return `${formatCurrency(coupon.discountValue || 0, currency)} ${coupon.discountLabel}`;
  }
  if (coupon.discountType === 'threshold') {
    return `${coupon.discountValue}% off ${formatCurrency(coupon.thresholdValue || 0, currency)}+ ${coupon.discountLabel}`;
  }
  return coupon.discountLabel;
};

export function OffersPage() {
  const { data: storeProfile } = useStoreProfile();
  const currency = storeProfile?.currency || 'USD';
  const [tab, setTab] = useState<'promotions' | 'coupons' | 'create'>('promotions');
  const [form, setForm] = useState({ name: '', type: 'Percentage', value: '', category: 'Fresh Produce', start: '', end: '', description: '' });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Offers & Promotions</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage discounts, coupons, and campaigns</p>
        </div>
        <button onClick={() => setTab('create')} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create Promotion
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Promotions', value: '3', icon: '🎯' },
          { label: 'Coupons Issued', value: '3,614', icon: '🎟️' },
          { label: 'Revenue from Offers', value: formatCurrency(49440, currency), icon: '💸' },
          { label: 'Avg Discount Rate', value: '12.4%', icon: '📉' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['promotions', 'coupons', 'create'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm capitalize border-b-2 transition-colors ${tab === t ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            style={{ fontWeight: tab === t ? 500 : 400 }}
          >
            {t === 'create' ? 'Create New' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Promotions Tab */}
      {tab === 'promotions' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Promotion', 'Type', 'Value', 'Category', 'Duration', 'Status', 'Used', 'Revenue', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {promotions.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="text-xs text-gray-400">{p.id}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{p.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 600 }}>{formatPromotionValue(p, currency)}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{p.category}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs text-gray-600">{p.start}</p>
                    <p className="text-xs text-gray-400">→ {p.end}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[p.status]}`} style={{ fontWeight: 500 }}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-700">{p.used.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 500 }}>{formatCurrency(p.revenue, currency)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupons Tab */}
      {tab === 'coupons' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Coupon Code', 'Discount', 'Used / Limit', 'Expires', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map(c => (
                <tr key={c.code} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm text-purple-700 bg-purple-50 px-2 py-0.5 rounded" style={{ fontWeight: 600 }}>{c.code}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 600 }}>{formatCouponDiscount(c, currency)}</td>
                  <td className="px-4 py-3.5">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{c.used.toLocaleString()}</span>
                        <span>{c.limit.toLocaleString()}</span>
                      </div>
                      <div className="w-32 h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-1.5 bg-green-500 rounded-full"
                          style={{ width: `${Math.min(100, (c.used / c.limit) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{c.expires}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-xs ${statusColors[c.status]}`} style={{ fontWeight: 500 }}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Form */}
      {tab === 'create' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm max-w-2xl">
          <h3 className="text-gray-900 mb-5" style={{ fontWeight: 600 }}>Create New Promotion</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Offer Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer Fresh Savings"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Discount Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 bg-white"
                >
                  {['Percentage', 'Fixed Amount', 'Buy X Get Y', 'Points Multiplier'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Discount Value</label>
                <input
                  value={form.value}
                  onChange={e => setForm({ ...form, value: e.target.value })}
                  placeholder="e.g. 15 or 5"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Applicable Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 bg-white"
              >
                {['All Products', 'Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Beverages', 'Snacks'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Start Date</label>
                <input type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>End Date</label>
                <input type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Description (optional)</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Brief description of this promotion..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">Create Promotion</button>
              <button onClick={() => setTab('promotions')} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
