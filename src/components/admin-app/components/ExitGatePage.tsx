import { useState, useEffect } from 'react';
import { DoorOpen, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const exitEvents = [
  { id: 'EXT-1021', customer: 'Maria Santos', time: '09:42:18', status: 'Cleared', items: 8, receipt: 'ORD-8821', gate: 'Gate A' },
  { id: 'EXT-1020', customer: 'Priya Nair', time: '09:41:55', status: 'Cleared', items: 12, receipt: 'ORD-8819', gate: 'Gate B' },
  { id: 'EXT-1019', customer: 'Unknown', time: '09:41:30', status: 'Alert', items: 3, receipt: null, gate: 'Gate A' },
  { id: 'EXT-1018', customer: 'Carlos Mendez', time: '09:41:12', status: 'Cleared', items: 5, receipt: 'ORD-8818', gate: 'Gate C' },
  { id: 'EXT-1017', customer: 'David Chen', time: '09:40:44', status: 'Cleared', items: 9, receipt: 'ORD-8816', gate: 'Gate B' },
  { id: 'EXT-1016', customer: 'Unknown', time: '09:40:22', status: 'Alert', items: 1, receipt: null, gate: 'Gate C' },
  { id: 'EXT-1015', customer: 'Lisa Thompson', time: '09:39:58', status: 'Cleared', items: 6, receipt: 'ORD-8815', gate: 'Gate A' },
  { id: 'EXT-1014', customer: 'Omar Hassan', time: '09:38:40', status: 'Cleared', items: 14, receipt: 'ORD-8814', gate: 'Gate B' },
];

const exitVolumeData = [
  { hour: '8am', exits: 48 }, { hour: '9am', exits: 112 }, { hour: '10am', exits: 98 },
  { hour: '11am', exits: 145 }, { hour: '12pm', exits: 198 }, { hour: '1pm', exits: 178 },
  { hour: '2pm', exits: 134 }, { hour: '3pm', exits: 120 }, { hour: '4pm', exits: 160 },
];

const gates = [
  { id: 'Gate A', status: 'Active', exits: 412, alerts: 2 },
  { id: 'Gate B', status: 'Active', exits: 384, alerts: 1 },
  { id: 'Gate C', status: 'Active', exits: 318, alerts: 3 },
  { id: 'Gate D', status: 'Maintenance', exits: 0, alerts: 0 },
];

export function ExitGatePage() {
  const [totalExits, setTotalExits] = useState(1114);
  const [alerts, setAlerts] = useState(6);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setTotalExits(t => t + (Math.random() > 0.6 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Exit Gate Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time gate activity and security alerts</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <div className={`w-2 h-2 rounded-full bg-green-500 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
          <span className="text-xs text-green-700" style={{ fontWeight: 500 }}>All gates online</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Exits Today', value: totalExits.toLocaleString(), icon: DoorOpen, color: 'bg-blue-50 text-blue-600' },
          { label: 'Cleared', value: (totalExits - alerts).toLocaleString(), icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Active Alerts', value: alerts.toString(), icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
          { label: 'Avg Exit Time', value: '22s', icon: Clock, color: 'bg-orange-50 text-orange-600' },
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
        {/* Exit Volume Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Exit Volume by Hour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={exitVolumeData}>
              <defs>
                <linearGradient id="exitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
              <Area type="monotone" dataKey="exits" stroke="#3b82f6" strokeWidth={2} fill="url(#exitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gate Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>Gate Status</h3>
          <div className="space-y-3">
            {gates.map(gate => (
              <div key={gate.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${gate.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{gate.id}</span>
                  </div>
                  {gate.alerts > 0 && (
                    <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>{gate.alerts} alerts</span>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{gate.exits.toLocaleString()} exits</span>
                  <span className={gate.status === 'Active' ? 'text-green-600' : 'text-gray-400'}>{gate.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exit Event Feed */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Live Exit Feed</h3>
          <span className="text-xs text-gray-400">Auto-refreshing</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Event ID', 'Customer', 'Gate', 'Receipt', 'Items', 'Status', 'Time'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {exitEvents.map(evt => (
              <tr key={evt.id} className={`hover:bg-gray-50 transition-colors ${evt.status === 'Alert' ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3 text-xs text-gray-500 font-mono">{evt.id}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{evt.customer}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{evt.gate}</td>
                <td className="px-4 py-3 text-xs text-blue-600">{evt.receipt ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{evt.items}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                    evt.status === 'Cleared' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`} style={{ fontWeight: 500 }}>
                    {evt.status === 'Alert' && <AlertTriangle className="w-3 h-3" />}
                    {evt.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{evt.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
