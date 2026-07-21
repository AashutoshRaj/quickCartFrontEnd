import { useState } from 'react';
import { Search, Filter, Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

const allOrders = [
  { id: 'ORD-8821', customer: 'Maria Santos', phone: '+1 555-0142', items: 8, amount: '$142.30', payment: 'Paid', status: 'Completed', date: 'Jun 13, 09:42' },
  { id: 'ORD-8820', customer: 'James Okafor', phone: '+234 801-0023', items: 3, amount: '$38.75', payment: 'Paid', status: 'Processing', date: 'Jun 13, 09:40' },
  { id: 'ORD-8819', customer: 'Priya Nair', phone: '+91 98765-43210', items: 12, amount: '$215.60', payment: 'Paid', status: 'Completed', date: 'Jun 13, 09:38' },
  { id: 'ORD-8818', customer: 'Carlos Mendez', phone: '+52 55 1234-5678', items: 5, amount: '$89.20', payment: 'Paid', status: 'Completed', date: 'Jun 13, 09:35' },
  { id: 'ORD-8817', customer: 'Anna Kowalski', phone: '+48 600-123-456', items: 2, amount: '$24.99', payment: 'Paid', status: 'Pending', date: 'Jun 13, 09:31' },
  { id: 'ORD-8816', customer: 'David Chen', phone: '+1 555-0198', items: 9, amount: '$178.40', payment: 'Paid', status: 'Completed', date: 'Jun 13, 09:28' },
  { id: 'ORD-8815', customer: 'Lisa Thompson', phone: '+1 555-0203', items: 6, amount: '$96.15', payment: 'Paid', status: 'Cancelled', date: 'Jun 13, 09:22' },
  { id: 'ORD-8814', customer: 'Omar Hassan', phone: '+20 100-123-4567', items: 14, amount: '$302.80', payment: 'Refunded', status: 'Refunded', date: 'Jun 13, 09:15' },
  { id: 'ORD-8813', customer: 'Sofia Rodriguez', phone: '+34 612-345-678', items: 7, amount: '$134.90', payment: 'Paid', status: 'Completed', date: 'Jun 13, 09:10' },
  { id: 'ORD-8812', customer: 'Marcus Johnson', phone: '+1 555-0167', items: 4, amount: '$67.50', payment: 'Paid', status: 'Processing', date: 'Jun 13, 09:05' },
  { id: 'ORD-8811', customer: 'Yuki Tanaka', phone: '+81 90-1234-5678', items: 11, amount: '$198.20', payment: 'Paid', status: 'Completed', date: 'Jun 13, 08:58' },
  { id: 'ORD-8810', customer: 'Aisha Bello', phone: '+234 802-1234', items: 3, amount: '$41.60', payment: 'Paid', status: 'Pending', date: 'Jun 13, 08:51' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  Processing: 'bg-blue-50 text-blue-700',
  Pending: 'bg-yellow-50 text-yellow-700',
  Cancelled: 'bg-red-50 text-red-600',
  Refunded: 'bg-gray-100 text-gray-600',
};

const paymentColors: Record<string, string> = {
  Paid: 'bg-green-50 text-green-700',
  Refunded: 'bg-orange-50 text-orange-700',
};

const orderItems = [
  { name: 'Organic Whole Milk 1L', qty: 2, price: '$4.98', total: '$9.96' },
  { name: 'Sourdough Bread Loaf', qty: 1, price: '$6.49', total: '$6.49' },
  { name: 'Free-Range Eggs 12pk', qty: 2, price: '$8.99', total: '$17.98' },
  { name: 'Avocado (each)', qty: 3, price: '$1.49', total: '$4.47' },
  { name: 'Atlantic Salmon Fillet 500g', qty: 1, price: '$18.99', total: '$18.99' },
  { name: 'Greek Yogurt 500g', qty: 2, price: '$5.49', total: '$10.98' },
  { name: 'Cherry Tomatoes 250g', qty: 2, price: '$3.49', total: '$6.98' },
  { name: 'Extra Virgin Olive Oil 750ml', qty: 1, price: '$12.99', total: '$12.99' },
];

const tabs = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'];

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof allOrders[0] | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = allOrders.filter(o =>
    (activeTab === 'All' || o.status === activeTab) &&
    (o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allOrders.length} orders today</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Status tabs + search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-4">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-4 py-3.5 text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={{ fontWeight: activeTab === tab ? 500 : 400 }}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Order ID', 'Customer', 'Products', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5 text-xs text-blue-600" style={{ fontWeight: 600 }}>{order.id}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.phone}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{order.items} items</td>
                <td className="px-4 py-3.5 text-sm text-gray-900" style={{ fontWeight: 600 }}>{order.amount}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs ${paymentColors[order.payment]}`} style={{ fontWeight: 500 }}>{order.payment}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs ${statusColors[order.status]}`} style={{ fontWeight: 500 }}>{order.status}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-gray-400">{order.date}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => setSelectedOrder(order)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} orders</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 rounded text-xs transition-colors ${page === p ? 'bg-green-500 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-end" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white h-full w-[480px] shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{selectedOrder.id}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status */}
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded text-xs ${statusColors[selectedOrder.status]}`} style={{ fontWeight: 500 }}>{selectedOrder.status}</span>
                <span className={`px-3 py-1 rounded text-xs ${paymentColors[selectedOrder.payment]}`} style={{ fontWeight: 500 }}>{selectedOrder.payment}</span>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2" style={{ fontWeight: 500 }}>Customer</p>
                <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{selectedOrder.customer}</p>
                <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.phone}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3" style={{ fontWeight: 500 }}>Items Purchased ({selectedOrder.items})</p>
                <div className="space-y-2">
                  {orderItems.slice(0, selectedOrder.items).map(item => (
                    <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div>
                        <p className="text-sm text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty {item.qty} × {item.price}</p>
                      </div>
                      <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{item.total}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Total Amount</span>
                <span className="text-lg text-gray-900" style={{ fontWeight: 700 }}>{selectedOrder.amount}</span>
              </div>

              {/* Timeline */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-3" style={{ fontWeight: 500 }}>Timeline</p>
                {[
                  { label: 'Order Placed', time: selectedOrder.date, done: true },
                  { label: 'Payment Confirmed', time: selectedOrder.date, done: selectedOrder.payment === 'Paid' },
                  { label: 'Order Processed', time: selectedOrder.date, done: selectedOrder.status !== 'Pending' },
                  { label: 'Completed', time: selectedOrder.date, done: selectedOrder.status === 'Completed' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.done ? 'bg-green-500' : 'bg-gray-200'}`}>
                      {step.done && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontWeight: step.done ? 500 : 400 }}>{step.label}</p>
                      {step.done && <p className="text-xs text-gray-400">{step.time}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
