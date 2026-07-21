import { useState } from 'react';
import { Search, Filter, Download, Eye, X, Star, ShoppingBag, TrendingUp } from 'lucide-react';

const customers = [
  { id: 'C-1001', name: 'Maria Santos', phone: '+1 555-0142', email: 'maria.santos@email.com', orders: 84, ltv: '$4,210', lastPurchase: 'Jun 13, 2026', loyalty: 2840, tier: 'Gold', joined: 'Jan 2024' },
  { id: 'C-1002', name: 'James Okafor', phone: '+234 801-0023', email: 'james.o@email.com', orders: 31, ltv: '$1,480', lastPurchase: 'Jun 13, 2026', loyalty: 980, tier: 'Silver', joined: 'Mar 2024' },
  { id: 'C-1003', name: 'Priya Nair', phone: '+91 98765-43210', email: 'priya.nair@email.com', orders: 127, ltv: '$8,920', lastPurchase: 'Jun 13, 2026', loyalty: 5430, tier: 'Platinum', joined: 'Nov 2023' },
  { id: 'C-1004', name: 'Carlos Mendez', phone: '+52 55 1234-5678', email: 'carlos.m@email.com', orders: 56, ltv: '$2,790', lastPurchase: 'Jun 12, 2026', loyalty: 1780, tier: 'Silver', joined: 'Feb 2024' },
  { id: 'C-1005', name: 'Anna Kowalski', phone: '+48 600-123-456', email: 'anna.k@email.com', orders: 19, ltv: '$760', lastPurchase: 'Jun 13, 2026', loyalty: 430, tier: 'Bronze', joined: 'May 2024' },
  { id: 'C-1006', name: 'David Chen', phone: '+1 555-0198', email: 'david.chen@email.com', orders: 203, ltv: '$14,200', lastPurchase: 'Jun 13, 2026', loyalty: 8920, tier: 'Platinum', joined: 'Aug 2023' },
  { id: 'C-1007', name: 'Lisa Thompson', phone: '+1 555-0203', email: 'lisa.t@email.com', orders: 45, ltv: '$2,130', lastPurchase: 'Jun 10, 2026', loyalty: 1290, tier: 'Silver', joined: 'Apr 2024' },
  { id: 'C-1008', name: 'Omar Hassan', phone: '+20 100-123-4567', email: 'omar.h@email.com', orders: 72, ltv: '$3,840', lastPurchase: 'Jun 13, 2026', loyalty: 2140, tier: 'Gold', joined: 'Dec 2023' },
  { id: 'C-1009', name: 'Sofia Rodriguez', phone: '+34 612-345-678', email: 'sofia.r@email.com', orders: 38, ltv: '$1,920', lastPurchase: 'Jun 11, 2026', loyalty: 1040, tier: 'Silver', joined: 'Jan 2024' },
  { id: 'C-1010', name: 'Yuki Tanaka', phone: '+81 90-1234-5678', email: 'yuki.t@email.com', orders: 156, ltv: '$9,780', lastPurchase: 'Jun 13, 2026', loyalty: 6200, tier: 'Platinum', joined: 'Sep 2023' },
];

const tierColors: Record<string, string> = {
  Bronze: 'bg-orange-50 text-orange-700',
  Silver: 'bg-gray-100 text-gray-600',
  Gold: 'bg-yellow-50 text-yellow-700',
  Platinum: 'bg-purple-50 text-purple-700',
};

const purchaseHistory = [
  { id: 'ORD-8821', date: 'Jun 13, 2026', amount: '$142.30', items: 8, status: 'Completed' },
  { id: 'ORD-8701', date: 'Jun 10, 2026', amount: '$98.40', items: 6, status: 'Completed' },
  { id: 'ORD-8589', date: 'Jun 7, 2026', amount: '$210.80', items: 12, status: 'Completed' },
  { id: 'ORD-8440', date: 'Jun 3, 2026', amount: '$67.50', items: 4, status: 'Completed' },
  { id: 'ORD-8301', date: 'May 29, 2026', amount: '$185.20', items: 10, status: 'Completed' },
];

const favoriteProducts = ['Organic Whole Milk 1L', 'Avocado (each)', 'Sourdough Bread Loaf', 'Greek Yogurt 500g', 'Free-Range Eggs 12pk'];

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof customers[0] | null>(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Customers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{customers.length.toLocaleString()} registered customers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: '3,921', icon: '👥' },
          { label: 'Platinum Members', value: '312', icon: '💎' },
          { label: 'Active This Month', value: '2,840', icon: '📈' },
          { label: 'Avg Lifetime Value', value: '$4,920', icon: '💰' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 w-72"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" />
            Filter by Tier
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Customer', 'Phone', 'Email', 'Orders', 'Lifetime Value', 'Loyalty Points', 'Tier', 'Last Purchase', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{customer.name}</p>
                      <p className="text-xs text-gray-400">{customer.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{customer.phone}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{customer.email}</td>
                <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 500 }}>{customer.orders}</td>
                <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 600 }}>{customer.ltv}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{customer.loyalty.toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2 py-0.5 rounded text-xs ${tierColors[customer.tier]}`} style={{ fontWeight: 500 }}>{customer.tier}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-400">{customer.lastPurchase}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => setSelected(customer)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div className="bg-white h-full w-[500px] shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Customer Profile</h3>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Profile header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl" style={{ fontWeight: 700 }}>
                  {selected.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-gray-900" style={{ fontWeight: 600 }}>{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs ${tierColors[selected.tier]}`} style={{ fontWeight: 500 }}>{selected.tier} Member</span>
                    <span className="text-xs text-gray-400">Since {selected.joined}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Orders', value: selected.orders, icon: ShoppingBag },
                  { label: 'Lifetime Value', value: selected.ltv, icon: TrendingUp },
                  { label: 'Loyalty Points', value: selected.loyalty.toLocaleString(), icon: Star },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-lg text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Favorite Products */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2" style={{ fontWeight: 500 }}>Favourite Products</p>
                <div className="flex flex-wrap gap-2">
                  {favoriteProducts.map(p => (
                    <span key={p} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-lg">{p}</span>
                  ))}
                </div>
              </div>

              {/* Purchase History */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3" style={{ fontWeight: 500 }}>Recent Purchases</p>
                <div className="space-y-2">
                  {purchaseHistory.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-blue-600" style={{ fontWeight: 500 }}>{order.id}</p>
                        <p className="text-xs text-gray-400">{order.date} · {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{order.amount}</p>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
