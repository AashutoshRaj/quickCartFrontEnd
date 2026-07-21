import { useState, useEffect } from 'react';
import { Activity, ShoppingCart, Users, Zap, TrendingUp, Wifi } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const initialTransactions = [
  { id: 'TXN-9041', customer: 'Maria Santos', items: 8, amount: '$142.30', cashier: 'Lane 3', status: 'completed', time: '09:42:11' },
  { id: 'TXN-9040', customer: 'James Okafor', items: 3, amount: '$38.75', cashier: 'Lane 1', status: 'processing', time: '09:42:05' },
  { id: 'TXN-9039', customer: 'Priya Nair', items: 12, amount: '$215.60', cashier: 'Lane 5', status: 'completed', time: '09:41:58' },
  { id: 'TXN-9038', customer: 'Carlos Mendez', items: 5, amount: '$89.20', cashier: 'Self-Checkout 2', status: 'completed', time: '09:41:44' },
  { id: 'TXN-9037', customer: 'Anna Kowalski', items: 2, amount: '$24.99', cashier: 'Lane 2', status: 'completed', time: '09:41:30' },
  { id: 'TXN-9036', customer: 'David Chen', items: 9, amount: '$178.40', cashier: 'Lane 4', status: 'completed', time: '09:41:18' },
  { id: 'TXN-9035', customer: 'Lisa Thompson', items: 6, amount: '$96.15', cashier: 'Self-Checkout 1', status: 'completed', time: '09:41:02' },
  { id: 'TXN-9034', customer: 'Omar Hassan', items: 14, amount: '$302.80', cashier: 'Lane 3', status: 'completed', time: '09:40:49' },
];

const liveChartBase = [
  { t: '09:36', txn: 12 }, { t: '09:37', txn: 18 }, { t: '09:38', txn: 15 },
  { t: '09:39', txn: 22 }, { t: '09:40', txn: 19 }, { t: '09:41', txn: 27 }, { t: '09:42', txn: 24 },
];

const lanes = [
  { id: 'Lane 1', cashier: 'Sofia R.', status: 'active', queue: 3, currentTxn: 'TXN-9040' },
  { id: 'Lane 2', cashier: 'Marcus L.', status: 'active', queue: 1, currentTxn: 'TXN-9037' },
  { id: 'Lane 3', cashier: 'Aisha B.', status: 'active', queue: 5, currentTxn: 'TXN-9041' },
  { id: 'Lane 4', cashier: 'Kevin T.', status: 'active', queue: 2, currentTxn: 'TXN-9036' },
  { id: 'Lane 5', cashier: 'Rosa M.', status: 'active', queue: 4, currentTxn: 'TXN-9039' },
  { id: 'Self-Checkout 1', cashier: 'Automated', status: 'active', queue: 2, currentTxn: 'TXN-9035' },
  { id: 'Self-Checkout 2', cashier: 'Automated', status: 'idle', queue: 0, currentTxn: null },
  { id: 'Self-Checkout 3', cashier: 'Automated', status: 'maintenance', queue: 0, currentTxn: null },
];

export function LiveMonitorPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [chartData, setChartData] = useState(liveChartBase);
  const [pulse, setPulse] = useState(false);
  const [liveStats, setLiveStats] = useState({ revenue: 24839, orders: 1284, customers: 421, avgTxn: 19.3 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setLiveStats(s => ({
        revenue: s.revenue + Math.floor(Math.random() * 80 + 20),
        orders: s.orders + 1,
        customers: s.customers + (Math.random() > 0.7 ? 1 : 0),
        avgTxn: +(s.avgTxn + (Math.random() * 0.4 - 0.2)).toFixed(1),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Live Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time store activity and transaction feed</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <div className={`w-2 h-2 rounded-full bg-green-500 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
          <Wifi className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-green-700" style={{ fontWeight: 500 }}>Live — updating every 3s</span>
        </div>
      </div>

      {/* Live KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `$${liveStats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Total Orders', value: liveStats.orders.toLocaleString(), icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
          { label: 'Customers In-Store', value: liveStats.customers.toString(), icon: Users, color: 'text-purple-600 bg-purple-50' },
          { label: 'Avg Transaction', value: `$${liveStats.avgTxn}`, icon: Zap, color: 'text-orange-600 bg-orange-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Live Transaction Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-green-500" />
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Transactions per Minute</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="liveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="txn" stroke="#22c55e" strokeWidth={2} fill="url(#liveGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lane Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Checkout Lanes</h3>
          <div className="space-y-2">
            {lanes.map(lane => (
              <div key={lane.id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  lane.status === 'active' ? 'bg-green-500' :
                  lane.status === 'idle' ? 'bg-gray-300' : 'bg-red-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-800 truncate" style={{ fontWeight: 500 }}>{lane.id}</p>
                  <p className="text-xs text-gray-400 truncate">{lane.cashier}</p>
                </div>
                {lane.status === 'active' && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                    Q: {lane.queue}
                  </span>
                )}
                {lane.status === 'maintenance' && (
                  <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>
                    Maint.
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Transaction Feed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Live Transaction Feed</h3>
          <span className="text-xs text-gray-400">Auto-refreshing</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Transaction ID', 'Customer', 'Items', 'Amount', 'Lane', 'Status', 'Time'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs text-blue-600" style={{ fontWeight: 500 }}>{txn.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{txn.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{txn.items}</td>
                  <td className="px-4 py-3 text-sm text-gray-900" style={{ fontWeight: 500 }}>{txn.amount}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{txn.cashier}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                      txn.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`} style={{ fontWeight: 500 }}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{txn.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
