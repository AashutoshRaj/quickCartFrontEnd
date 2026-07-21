import { useState } from 'react';
import { Scan, RefreshCw, Edit2, Package, TrendingUp, MapPin } from 'lucide-react';

const recentScans = [
  { barcode: '5901234123457', name: 'Organic Whole Milk 1L', price: '$2.49', stock: 84, category: 'Dairy & Eggs', time: '09:42:11' },
  { barcode: '4006381333931', name: 'Sourdough Bread Loaf', price: '$6.49', stock: 32, category: 'Bakery', time: '09:38:05' },
  { barcode: '5000159484695', name: 'Free-Range Eggs 12pk', price: '$8.99', stock: 156, category: 'Dairy & Eggs', time: '09:31:44' },
  { barcode: '0885909456413', name: 'Avocado (each)', price: '$1.49', stock: 210, category: 'Fresh Produce', time: '09:28:22' },
  { barcode: '7613036250382', name: 'Greek Yogurt 500g', price: '$5.49', stock: 67, category: 'Dairy & Eggs', time: '09:15:18' },
];

const scannedProduct = {
  name: 'Organic Whole Milk 1L',
  barcode: '5901234123457',
  sku: 'QC-DAI-0012',
  price: '$2.49',
  cost: '$1.42',
  stock: 84,
  threshold: 20,
  category: 'Dairy & Eggs',
  brand: 'Green Valley Farms',
  location: 'Aisle 4, Shelf B',
  image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop&auto=format',
};

export function BarcodeScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [newStock, setNewStock] = useState('');

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      setBarcodeInput('5901234123457');
    }, 1800);
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>Barcode Scanner</h1>
        <p className="text-sm text-gray-500 mt-0.5">Scan products to view details, update stock, and manage inventory</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Scanner */}
        <div className="col-span-1 space-y-4">
          {/* Camera preview area */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div
              className="relative bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ height: 240 }}
            >
              {/* Simulated camera view */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                {scanning ? (
                  <>
                    <div className="w-16 h-16 border-4 border-green-400 rounded-full animate-ping opacity-60" />
                    <p className="text-green-400 text-sm" style={{ fontWeight: 500 }}>Scanning...</p>
                  </>
                ) : scanned ? (
                  <>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Scan className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-green-400 text-sm" style={{ fontWeight: 500 }}>Scan Complete</p>
                  </>
                ) : (
                  <>
                    {/* Scan frame overlay */}
                    <div className="w-36 h-24 border-2 border-white/40 rounded relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-400 rounded-tl" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-400 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-400 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-400 rounded-br" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-px w-full bg-green-400 opacity-70 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">Position barcode in frame</p>
                  </>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className={`flex items-center justify-center gap-2 mt-3 py-2 rounded-lg ${scanning ? 'bg-yellow-50' : scanned ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-yellow-400 animate-pulse' : scanned ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={`text-xs ${scanning ? 'text-yellow-700' : scanned ? 'text-green-700' : 'text-gray-500'}`} style={{ fontWeight: 500 }}>
                {scanning ? 'Scanning in progress' : scanned ? 'Product found' : 'Ready to scan'}
              </span>
            </div>

            <button
              onClick={handleScan}
              disabled={scanning}
              className="w-full mt-3 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
              {scanning ? 'Scanning...' : 'Simulate Scan'}
            </button>
          </div>

          {/* Manual barcode entry */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>Or enter barcode manually</p>
            <div className="flex gap-2">
              <input
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="5901234123457"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400 font-mono"
              />
              <button onClick={() => setScanned(true)} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <div className="col-span-2">
          {scanned ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-start gap-5">
                <img
                  src={scannedProduct.image}
                  alt={scannedProduct.name}
                  className="w-24 h-24 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-gray-900 text-lg" style={{ fontWeight: 700 }}>{scannedProduct.name}</h3>
                  <p className="text-sm text-gray-500">{scannedProduct.brand} · {scannedProduct.category}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{scannedProduct.barcode}</span>
                    <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{scannedProduct.sku}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Selling Price', value: scannedProduct.price, sub: `Cost: ${scannedProduct.cost}`, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
                  { label: 'Stock Available', value: scannedProduct.stock.toString(), sub: `Threshold: ${scannedProduct.threshold}`, icon: Package, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Location', value: scannedProduct.location, sub: 'Primary warehouse', icon: MapPin, color: 'bg-orange-50 text-orange-600' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-4 ${s.color.split(' ')[0]}`}>
                    <div className={`flex items-center gap-1.5 mb-1 ${s.color.split(' ')[1]}`}>
                      <s.icon className="w-3.5 h-3.5" />
                      <span className="text-xs" style={{ fontWeight: 500 }}>{s.label}</span>
                    </div>
                    <p className="text-gray-900 text-base" style={{ fontWeight: 700 }}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Quick stock update */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 500 }}>Quick Stock Update</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(e.target.value)}
                    placeholder="Enter new stock quantity"
                    className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-400"
                  />
                  <button className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                    Update Stock
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Edit Product
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                  <Package className="w-4 h-4" />
                  View Full Details
                </button>
                <button onClick={() => { setScanned(false); setBarcodeInput(''); }} className="ml-auto px-4 py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors">
                  Scan Another
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex items-center justify-center" style={{ minHeight: 320 }}>
              <div className="text-center">
                <Scan className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>No product scanned yet</p>
                <p className="text-gray-400 text-xs mt-1">Use the scanner or enter a barcode to look up a product</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-gray-900" style={{ fontWeight: 600 }}>Recent Scans</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {['Barcode', 'Product', 'Category', 'Price', 'Stock', 'Scanned At'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentScans.map(scan => (
              <tr key={scan.barcode} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setScanned(true)}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{scan.barcode}</td>
                <td className="px-4 py-3 text-sm text-gray-800" style={{ fontWeight: 500 }}>{scan.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{scan.category}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900" style={{ fontWeight: 600 }}>{scan.price}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${scan.stock < 50 ? 'text-orange-600' : 'text-gray-700'}`} style={{ fontWeight: 500 }}>{scan.stock}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{scan.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
