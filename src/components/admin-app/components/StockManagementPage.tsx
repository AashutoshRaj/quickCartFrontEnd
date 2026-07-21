import { useState } from 'react';
import { Package, AlertTriangle, XCircle, TrendingDown, Download, RefreshCw } from 'lucide-react';

const lowStockProducts = [
  { name: 'Organic Whole Milk 1L', sku: 'QC-DAI-0012', barcode: '5901234123457', category: 'Dairy & Eggs', stock: 12, threshold: 20, supplier: 'Green Valley Farms' },
  { name: 'Atlantic Salmon Fillet 500g', sku: 'QC-SEA-0041', barcode: '4012345678901', category: 'Meat & Seafood', stock: 8, threshold: 15, supplier: 'Ocean Fresh Co.' },
  { name: 'Greek Yogurt 500g', sku: 'QC-DAI-0034', barcode: '5000159484695', category: 'Dairy & Eggs', stock: 14, threshold: 25, supplier: 'Green Valley Farms' },
  { name: 'Sourdough Bread Loaf', sku: 'QC-BAK-0007', barcode: '4006381333931', category: 'Bakery', stock: 6, threshold: 12, supplier: 'Artisan Bakers Ltd.' },
  { name: 'Cherry Tomatoes 250g', sku: 'QC-PRO-0023', barcode: '7613036250382', category: 'Fresh Produce', stock: 18, threshold: 30, supplier: 'FarmDirect Produce' },
  { name: 'Extra Virgin Olive Oil 750ml', sku: 'QC-GRO-0091', barcode: '8712100654321', category: 'Grocery', stock: 9, threshold: 15, supplier: 'Mediterranean Imports' },
];

const outOfStockProducts = [
  { name: 'Almond Milk 1L Unsweetened', sku: 'QC-DAI-0088', barcode: '5011476102922', category: 'Dairy & Eggs', supplier: 'Plant Good Co.', daysOOS: 2 },
  { name: 'Wagyu Beef Ribeye 300g', sku: 'QC-MEA-0015', barcode: '4901777231596', category: 'Meat & Seafood', supplier: 'Premium Meats AU', daysOOS: 1 },
  { name: 'Gluten Free Bread Loaf', sku: 'QC-BAK-0019', barcode: '5000213622459', category: 'Bakery', supplier: 'FreeFrom Bakery', daysOOS: 4 },
];

export function StockManagementPage() {
  const [tab, setTab] = useState<'overview' | 'lowstock' | 'outofstock'>('overview');
  const [restockQty, setRestockQty] = useState<Record<string, string>>({});

  const metrics = [
    { label: 'Total Products', value: '52,400', icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'In Stock', value: '51,114', icon: Package, color: 'bg-green-50 text-green-600' },
    { label: 'Low Stock', value: '148', icon: AlertTriangle, color: 'bg-orange-50 text-orange-600' },
    { label: 'Out of Stock', value: '86', icon: XCircle, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Stock Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor and control inventory levels across all products</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            Bulk Update Stock
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${m.color}`}>
              <m.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{m.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Stock health bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Inventory Health</h3>
          <span className="text-xs text-gray-400">52,400 total products</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex gap-0.5">
          <div className="bg-green-500 rounded-l-full" style={{ width: '97.5%' }} title="In Stock" />
          <div className="bg-orange-400" style={{ width: '0.28%' }} title="Low Stock" />
          <div className="bg-red-400 rounded-r-full" style={{ width: '0.16%' }} title="Out of Stock" />
        </div>
        <div className="flex gap-5 mt-2">
          {[{ color: 'bg-green-500', label: 'In Stock 97.6%' }, { color: 'bg-orange-400', label: 'Low Stock 0.28%' }, { color: 'bg-red-400', label: 'Out of Stock 0.16%' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'lowstock', label: `Low Stock (${lowStockProducts.length})` },
          { key: 'outofstock', label: `Out of Stock (${outOfStockProducts.length})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-5 py-3 text-sm border-b-2 transition-colors ${tab === t.key ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            style={{ fontWeight: tab === t.key ? 500 : 400 }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Category breakdown */}
      {tab === 'overview' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Stock by Category</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Category', 'Total Products', 'In Stock', 'Low Stock', 'Out of Stock', 'Health'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { cat: 'Fresh Produce', total: 8420, inStock: 8380, low: 32, oos: 8, health: 99.5 },
                { cat: 'Dairy & Eggs', total: 6240, inStock: 6184, low: 42, oos: 14, health: 99.1 },
                { cat: 'Meat & Seafood', total: 4180, inStock: 4148, low: 24, oos: 8, health: 99.2 },
                { cat: 'Bakery', total: 3240, inStock: 3216, low: 18, oos: 6, health: 99.3 },
                { cat: 'Beverages', total: 5820, inStock: 5791, low: 22, oos: 7, health: 99.5 },
                { cat: 'Snacks', total: 9840, inStock: 9812, low: 20, oos: 8, health: 99.7 },
                { cat: 'Grocery', total: 14660, inStock: 14583, low: 33, oos: 44, health: 99.5 },
              ].map(row => (
                <tr key={row.cat} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 text-sm text-gray-800" style={{ fontWeight: 500 }}>{row.cat}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{row.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-green-700" style={{ fontWeight: 500 }}>{row.inStock.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-orange-600" style={{ fontWeight: 500 }}>{row.low}</td>
                  <td className="px-5 py-3.5 text-sm text-red-500" style={{ fontWeight: 500 }}>{row.oos}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full">
                        <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${row.health}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{row.health}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Low Stock Table */}
      {tab === 'lowstock' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Low Stock Products</h3>
            </div>
            <button className="text-xs text-green-600 hover:underline">Restock All</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Product', 'SKU', 'Category', 'Current Stock', 'Threshold', 'Supplier', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lowStockProducts.map(p => (
                <tr key={p.sku} className="hover:bg-orange-50/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="font-mono text-xs text-gray-400">{p.barcode}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{p.category}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-orange-600" style={{ fontWeight: 700 }}>{p.stock}</span>
                      <TrendingDown className="w-3 h-3 text-orange-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{p.threshold}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{p.supplier}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={restockQty[p.sku] || ''}
                        onChange={e => setRestockQty({ ...restockQty, [p.sku]: e.target.value })}
                        className="w-16 px-2 py-1 text-xs border border-gray-200 rounded-lg outline-none focus:border-green-400"
                      />
                      <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition-colors">Restock</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Out of Stock Table */}
      {tab === 'outofstock' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
            <XCircle className="w-4 h-4 text-red-500" />
            <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Out of Stock Products</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {['Product', 'SKU', 'Category', 'Supplier', 'Days OOS', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {outOfStockProducts.map(p => (
                <tr key={p.sku} className="hover:bg-red-50/20 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{p.name}</p>
                    <p className="font-mono text-xs text-gray-400">{p.barcode}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{p.sku}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{p.category}</td>
                  <td className="px-4 py-3.5 text-xs text-gray-600">{p.supplier}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.daysOOS >= 3 ? 'bg-red-100 text-red-700' : 'bg-orange-50 text-orange-700'}`} style={{ fontWeight: 500 }}>
                      {p.daysOOS}d
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors">Request Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
