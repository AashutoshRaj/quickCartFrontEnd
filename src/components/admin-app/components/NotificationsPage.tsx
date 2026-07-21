import { useState } from 'react';
import { Send, Users, MessageSquare, Bell, Mail, BarChart2, CheckCircle, Clock, XCircle } from 'lucide-react';

const campaigns = [
  { id: 'CMP-041', name: 'Weekend Flash Sale', channel: 'SMS', audience: 'All Customers', sent: 3920, delivered: 3841, opened: 2104, status: 'Completed', date: 'Jun 12, 2026' },
  { id: 'CMP-040', name: 'Fresh Produce Restock Alert', channel: 'Push', audience: 'Loyalty Members', sent: 1284, delivered: 1241, opened: 890, status: 'Completed', date: 'Jun 11, 2026' },
  { id: 'CMP-039', name: 'Summer Newsletter', channel: 'Email', audience: 'All Customers', sent: 3920, delivered: 3780, opened: 1540, status: 'Completed', date: 'Jun 10, 2026' },
  { id: 'CMP-038', name: 'Loyalty Points Bonus', channel: 'Push', audience: 'Gold & Platinum', sent: 0, delivered: 0, opened: 0, status: 'Scheduled', date: 'Jun 15, 2026' },
  { id: 'CMP-037', name: 'Exclusive Member Discount', channel: 'SMS', audience: 'Platinum Members', sent: 312, delivered: 308, opened: 271, status: 'Completed', date: 'Jun 8, 2026' },
];

const channelColors: Record<string, string> = {
  SMS: 'bg-green-50 text-green-700',
  Push: 'bg-blue-50 text-blue-700',
  Email: 'bg-purple-50 text-purple-700',
};

const statusColors: Record<string, string> = {
  Completed: 'bg-gray-100 text-gray-600',
  Scheduled: 'bg-blue-50 text-blue-700',
  Sending: 'bg-yellow-50 text-yellow-700',
};

const channelIcons: Record<string, React.ReactNode> = {
  SMS: <MessageSquare className="w-4 h-4" />,
  Push: <Bell className="w-4 h-4" />,
  Email: <Mail className="w-4 h-4" />,
};

export function NotificationsPage() {
  const [tab, setTab] = useState<'campaigns' | 'send' | 'analytics'>('campaigns');
  const [channel, setChannel] = useState('Push');
  const [audience, setAudience] = useState('All Customers');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [scheduleNow, setScheduleNow] = useState(true);

  const totalSent = campaigns.filter(c => c.status === 'Completed').reduce((s, c) => s + c.sent, 0);
  const totalOpened = campaigns.filter(c => c.status === 'Completed').reduce((s, c) => s + c.opened, 0);
  const avgOpen = totalSent ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Notification Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">SMS, push, and email campaigns</p>
        </div>
        <button onClick={() => setTab('send')} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
          <Send className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Campaigns', value: campaigns.length.toString(), icon: Bell, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Sent', value: totalSent.toLocaleString(), icon: Send, color: 'bg-green-50 text-green-600' },
          { label: 'Total Opened', value: totalOpened.toLocaleString(), icon: CheckCircle, color: 'bg-purple-50 text-purple-600' },
          { label: 'Avg Open Rate', value: `${avgOpen}%`, icon: BarChart2, color: 'bg-orange-50 text-orange-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-xl text-gray-900" style={{ fontWeight: 700 }}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['campaigns', 'send', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${tab === t ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            style={{ fontWeight: tab === t ? 500 : 400 }}
          >
            {t === 'send' ? 'Send Campaign' : t === 'analytics' ? 'Analytics' : 'All Campaigns'}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      {tab === 'campaigns' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Campaign', 'Channel', 'Audience', 'Sent', 'Delivered', 'Opened', 'Open Rate', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.map(c => {
                const openRate = c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(1) : '—';
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{c.name}</p>
                      <p className="text-xs text-gray-400">{c.id}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs ${channelColors[c.channel]}`} style={{ fontWeight: 500 }}>
                        {channelIcons[c.channel]}{c.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Users className="w-3 h-3 text-gray-400" />
                        {c.audience}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{c.sent.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{c.delivered.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{c.opened.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      {c.sent > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${Math.min(100, (c.opened / c.sent) * 100)}%` }} />
                          </div>
                          <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{openRate}%</span>
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-xs ${statusColors[c.status]}`} style={{ fontWeight: 500 }}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{c.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Campaign */}
      {tab === 'send' && (
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Compose Campaign</h3>

            {/* Channel selector */}
            <div>
              <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Channel</label>
              <div className="flex gap-3">
                {['SMS', 'Push', 'Email'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                      channel === ch ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    style={{ fontWeight: channel === ch ? 500 : 400 }}
                  >
                    {channelIcons[ch]}{ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Audience</label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 bg-white"
              >
                {['All Customers', 'Loyalty Members', 'Platinum Members', 'Gold & Platinum', 'Inactive Customers', 'New Customers (last 30 days)'].map(a => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>
                {channel === 'Email' ? 'Subject Line' : 'Title'}
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={channel === 'SMS' ? 'QuickCart: Your weekend offer...' : channel === 'Push' ? 'Weekend Flash Sale 🛒' : 'Your Exclusive QuickCart Offer Inside'}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder={
                  channel === 'SMS' ? 'Hi {name}, enjoy 20% off fresh produce this weekend at QuickCart! Use code FRESH20. Valid Sat-Sun only.'
                  : channel === 'Push' ? 'Flash sale now on! Get 20% off fresh produce all weekend long. Tap to shop.'
                  : 'Dear {name},\n\nWe have an exclusive offer just for you this weekend...'
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 resize-none"
              />
              {channel === 'SMS' && (
                <p className="text-xs text-gray-400 mt-1">{message.length}/160 characters</p>
              )}
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Schedule</label>
              <div className="flex gap-3">
                <button onClick={() => setScheduleNow(true)} className={`px-4 py-2 rounded-lg border text-sm transition-colors ${scheduleNow ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Send Now
                </button>
                <button onClick={() => setScheduleNow(false)} className={`px-4 py-2 rounded-lg border text-sm transition-colors ${!scheduleNow ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  Schedule
                </button>
                {!scheduleNow && (
                  <input type="datetime-local" className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400" />
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                {scheduleNow ? 'Send Now' : 'Schedule Campaign'}
              </button>
              <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">Save Draft</button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-gray-700 mb-4 text-sm" style={{ fontWeight: 600 }}>Preview</h4>
              {channel === 'Push' && (
                <div className="bg-gray-900 rounded-2xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-xs" style={{ fontWeight: 700 }}>Q</div>
                    <span className="text-xs text-gray-400">QuickCart · now</span>
                  </div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>{title || 'Your notification title'}</p>
                  <p className="text-xs text-gray-400 mt-1">{message || 'Your notification message will appear here.'}</p>
                </div>
              )}
              {channel === 'SMS' && (
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-[220px]">
                  <p className="text-sm text-gray-800">{message || 'Your SMS message will appear here.'}</p>
                  <p className="text-xs text-gray-400 mt-1 text-right">QuickCart</p>
                </div>
              )}
              {channel === 'Email' && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-green-500 p-4 text-white text-center">
                    <p className="text-sm" style={{ fontWeight: 700 }}>QuickCart</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{title || 'Email Subject'}</p>
                    <p className="text-xs text-gray-500 mt-2">{message || 'Email body preview...'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Audience estimate */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <h4 className="text-gray-700 mb-3 text-sm" style={{ fontWeight: 600 }}>Audience Estimate</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Recipients</span>
                  <span className="text-gray-900" style={{ fontWeight: 600 }}>
                    {audience === 'All Customers' ? '3,920' : audience === 'Loyalty Members' ? '1,284' : audience === 'Platinum Members' ? '312' : '840'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. Delivery Rate</span>
                  <span className="text-green-600" style={{ fontWeight: 500 }}>~98.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. Open Rate</span>
                  <span className="text-blue-600" style={{ fontWeight: 500 }}>~53.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { channel: 'SMS', sent: 4232, delivered: 4149, opened: 2842, rate: '67.1%', color: 'green' },
            { channel: 'Push Notification', sent: 1284, delivered: 1241, opened: 890, rate: '69.3%', color: 'blue' },
            { channel: 'Email', sent: 3920, delivered: 3780, opened: 1540, rate: '39.3%', color: 'purple' },
          ].map(ch => (
            <div key={ch.channel} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                {ch.channel === 'SMS' && <MessageSquare className="w-4 h-4 text-green-500" />}
                {ch.channel === 'Push Notification' && <Bell className="w-4 h-4 text-blue-500" />}
                {ch.channel === 'Email' && <Mail className="w-4 h-4 text-purple-500" />}
                <h4 className="text-gray-800" style={{ fontWeight: 600 }}>{ch.channel}</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Sent', value: ch.sent.toLocaleString(), icon: Send },
                  { label: 'Delivered', value: ch.delivered.toLocaleString(), icon: CheckCircle },
                  { label: 'Opened', value: ch.opened.toLocaleString(), icon: Mail },
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <stat.icon className="w-3.5 h-3.5" />
                      {stat.label}
                    </div>
                    <span className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{stat.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500" style={{ fontWeight: 500 }}>Open Rate</span>
                    <span className="text-base" style={{ fontWeight: 700, color: ch.color === 'green' ? '#22c55e' : ch.color === 'blue' ? '#3b82f6' : '#a855f7' }}>{ch.rate}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: ch.rate,
                        backgroundColor: ch.color === 'green' ? '#22c55e' : ch.color === 'blue' ? '#3b82f6' : '#a855f7'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
