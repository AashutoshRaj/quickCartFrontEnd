import { useState } from 'react';
import {
  TrendingUp, ShoppingCart, Users, Package, AlertTriangle, Clock,
  Plus, Upload, Tag, Eye, UserCog, ArrowUpRight, ArrowDownRight,
  RefreshCw, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStoreProfile } from '../../../hooks/useStoreProfile';
import { useAuth } from '../../../admin-auth/AuthContext';

const kpiCards = [
  { label: "Today's Revenue", value: '$24,839', change: '+12.4%', up: true, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
  { label: "Today's Orders", value: '1,284', change: '+8.1%', up: true, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Customers', value: '3,921', change: '+5.3%', up: true, icon: Users, color: 'bg-purple-50 text-purple-600' },
  { label: 'Products in Inventory', value: '52,400', change: '+234', up: true, icon: Package, color: 'bg-orange-50 text-orange-600' },
  { label: 'Low Stock Products', value: '148', change: '+22', up: false, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
  { label: 'Pending Orders', value: '67', change: '-14', up: true, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
];

const revenueData = [
  { day: 'Mon', revenue: 18200, orders: 920 },
  { day: 'Tue', revenue: 21400, orders: 1080 },
  { day: 'Wed', revenue: 19800, orders: 990 },
  { day: 'Thu', revenue: 23100, orders: 1150 },
  { day: 'Fri', revenue: 27300, orders: 1380 },
  { day: 'Sat', revenue: 31200, orders: 1580 },
  { day: 'Sun', revenue: 24839, orders: 1284 },
];

const categoryData = [
  { name: 'Fresh Produce', value: 28, color: '#22c55e' },
  { name: 'Dairy & Eggs', value: 18, color: '#3b82f6' },
  { name: 'Meat & Seafood', value: 15, color: '#f97316' },
  { name: 'Bakery', value: 12, color: '#a855f7' },
  { name: 'Beverages', value: 14, color: '#06b6d4' },
  { name: 'Snacks', value: 13, color: '#eab308' },
];

const topProducts = [
  { name: 'Organic Whole Milk 1L', sold: 842, revenue: '$2,105', trend: 'up' },
  { name: 'Sourdough Bread Loaf', sold: 734, revenue: '$1,835', trend: 'up' },
  { name: 'Free-Range Eggs 12pk', sold: 698, revenue: '$2,094', trend: 'up' },
  { name: 'Atlantic Salmon Fillet', sold: 521, revenue: '$5,210', trend: 'down' },
  { name: 'Avocado (each)', sold: 904, revenue: '$1,356', trend: 'up' },
];

const peakHoursData = [
  { hour: '6am', customers: 45 }, { hour: '7am', customers: 120 },
  { hour: '8am', customers: 210 }, { hour: '9am', customers: 280 },
  { hour: '10am', customers: 320 }, { hour: '11am', customers: 390 },
  { hour: '12pm', customers: 480 }, { hour: '1pm', customers: 420 },
  { hour: '2pm', customers: 350 }, { hour: '3pm', customers: 310 },
  { hour: '4pm', customers: 430 }, { hour: '5pm', customers: 510 },
  { hour: '6pm', customers: 460 }, { hour: '7pm', customers: 340 },
  { hour: '8pm', customers: 190 }, { hour: '9pm', customers: 80 },
];

const recentActivity = [
  { type: 'order', message: 'New order #ORD-8821 from Maria Santos — $142.30', time: '2 min ago', color: 'bg-blue-500' },
  { type: 'stock', message: 'Low stock alert: Organic Milk 1L — 12 units remaining', time: '5 min ago', color: 'bg-red-500' },
  { type: 'customer', message: 'New customer registered: James Okafor (+234)', time: '11 min ago', color: 'bg-green-500' },
  { type: 'order', message: 'Order #ORD-8819 completed — $89.50', time: '18 min ago', color: 'bg-blue-500' },
  { type: 'import', message: 'Product import completed: 2,400 items synced', time: '34 min ago', color: 'bg-purple-500' },
  { type: 'stock', message: 'Restock confirmed: Atlantic Salmon — 200 units added', time: '1 hr ago', color: 'bg-orange-500' },
];

const quickActions = [
  { icon: Plus, label: 'Add Product', color: 'bg-green-500 hover:bg-green-600' },
  { icon: Upload, label: 'Import Products', color: 'bg-blue-500 hover:bg-blue-600' },
  { icon: Tag, label: 'Create Offer', color: 'bg-purple-500 hover:bg-purple-600' },
  { icon: Eye, label: 'View Orders', color: 'bg-orange-500 hover:bg-orange-600' },
  { icon: UserCog, label: 'Manage Staff', color: 'bg-slate-500 hover:bg-slate-600' },
];

export function DashboardPage() {
  const [revenueRange, setRevenueRange] = useState('7d');
  const { user } = useAuth();
  const { data: storeProfile } = useStoreProfile();

  const dashboardDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const storeName = storeProfile?.name || user?.storeName || 'Your Store';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{dashboardDate} · {storeName}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className={`text-xs flex items-center gap-0.5 ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.change}
              </span>
            </div>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm transition-colors ${action.color}`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Revenue Trend</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {['7d', '30d', '90d'].map(r => (
                <button
                  key={r}
                  onClick={() => setRevenueRange(r)}
                  className={`px-3 py-1 rounded-md text-xs transition-colors ${revenueRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" strokeWidth={0}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-gray-600">{c.name}</span>
                </div>
                <span className="text-gray-900" style={{ fontWeight: 500 }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Peak Hours */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Peak Shopping Hours</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={peakHoursData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Bar dataKey="customers" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4" style={{ fontWeight: 600 }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 truncate" style={{ fontWeight: 500 }}>{p.name}</p>
                  <p className="text-xs text-gray-400">{p.sold} sold · {p.revenue}</p>
                </div>
                <span className={`text-xs ${p.trend === 'up' ? 'text-green-500' : 'text-red-400'}`}>
                  {p.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Recent Activity</h3>
          <button className="text-xs text-green-600 hover:underline">View all</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{item.message}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
