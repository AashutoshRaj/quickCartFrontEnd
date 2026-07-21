import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 142000, orders: 5820 },
  { month: 'Feb', revenue: 128000, orders: 5240 },
  { month: 'Mar', revenue: 158000, orders: 6380 },
  { month: 'Apr', revenue: 172000, orders: 6940 },
  { month: 'May', revenue: 184000, orders: 7420 },
  { month: 'Jun', revenue: 198000, orders: 7980 },
];

const categoryPerf = [
  { name: 'Fresh Produce', revenue: 58400, growth: 14.2 },
  { name: 'Dairy & Eggs', revenue: 41200, growth: 8.6 },
  { name: 'Meat & Seafood', revenue: 36800, growth: 11.3 },
  { name: 'Bakery', revenue: 28100, growth: 6.4 },
  { name: 'Beverages', revenue: 32400, growth: 18.9 },
  { name: 'Snacks', revenue: 24600, growth: -2.1 },
];

const topProducts = [
  { rank: 1, name: 'Organic Whole Milk 1L', units: 12840, revenue: '$32,100', growth: '+12%' },
  { rank: 2, name: 'Sourdough Bread Loaf', units: 10920, revenue: '$27,300', growth: '+8%' },
  { rank: 3, name: 'Free-Range Eggs 12pk', units: 9840, revenue: '$29,520', growth: '+15%' },
  { rank: 4, name: 'Avocado (each)', units: 18200, revenue: '$27,300', growth: '+22%' },
  { rank: 5, name: 'Atlantic Salmon Fillet', units: 4820, revenue: '$48,200', growth: '+9%' },
  { rank: 6, name: 'Greek Yogurt 500g', units: 8420, revenue: '$21,050', growth: '+11%' },
  { rank: 7, name: 'Cherry Tomatoes 250g', units: 9100, revenue: '$18,200', growth: '-3%' },
  { rank: 8, name: 'Olive Oil 750ml', units: 3840, revenue: '$24,960', growth: '+7%' },
];

const retentionData = [
  { month: 'Jan', newCustomers: 240, returning: 580 },
  { month: 'Feb', newCustomers: 180, returning: 620 },
  { month: 'Mar', newCustomers: 310, returning: 640 },
  { month: 'Apr', newCustomers: 290, returning: 680 },
  { month: 'May', newCustomers: 340, returning: 710 },
  { month: 'Jun', newCustomers: 380, returning: 740 },
];

const CATEGORY_COLORS = ['#22c55e', '#3b82f6', '#f97316', '#a855f7', '#06b6d4', '#ef4444'];

export function AnalyticsPage() {
  const [period, setPeriod] = useState('6m');

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sales performance and business insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {['1m', '3m', '6m', '1y'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-md text-xs transition-colors ${period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{p}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (6m)', value: '$982,000', change: '+14.2%', up: true },
          { label: 'Total Orders (6m)', value: '39,780', change: '+11.8%', up: true },
          { label: 'Avg Order Value', value: '$24.69', change: '+2.1%', up: true },
          { label: 'Customer Retention', value: '74.8%', change: '+3.2%', up: true },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            <p className={`text-xs mt-1 ${k.up ? 'text-green-600' : 'text-red-500'}`} style={{ fontWeight: 500 }}>{k.change} vs prev period</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Monthly Revenue & Orders</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="revA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v: number, name: string) => [name === 'revenue' ? `$${v.toLocaleString()}` : v.toLocaleString(), name === 'revenue' ? 'Revenue' : 'Orders']} />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#revA)" name="revenue" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} dot={false} name="orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Category Revenue</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryPerf} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                {categoryPerf.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Retention */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Customer Retention</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={retentionData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Legend />
              <Bar dataKey="returning" name="Returning" fill="#22c55e" radius={[3, 3, 0, 0]} stackId="a" />
              <Bar dataKey="newCustomers" name="New" fill="#3b82f6" radius={[3, 3, 0, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Best Selling Products</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Rank', 'Product', 'Units Sold', 'Revenue', 'Growth'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topProducts.map(p => (
              <tr key={p.rank} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <span className={`w-6 h-6 rounded flex items-center justify-center text-xs ${p.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`} style={{ fontWeight: 700 }}>
                    {p.rank}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-800" style={{ fontWeight: 500 }}>{p.name}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{p.units.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-sm text-gray-900" style={{ fontWeight: 600 }}>{p.revenue}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs ${p.growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}`} style={{ fontWeight: 500 }}>{p.growth}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
