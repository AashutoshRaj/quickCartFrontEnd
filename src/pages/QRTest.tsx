import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * QR Test Page - Generate scannable QR codes for testing
 * Test store QR codes and product barcodes
 */
const QRTest: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();

  // Test store IDs - use these to test store scanning
  const testStores = [
    { id: '6a5cbbf39827da61e1420bae6a7e', name: 'Test Store 1' },
    { id: '6a5cbbf39827da61e1420bae6a7f', name: 'Test Store 2' },
    { id: '6a5cbbf39827da61e1420bae6a80', name: 'Test Store 3' },
  ];

  // Test product barcodes
  const testBarcodes = [
    { barcode: '8901858101100', name: 'Test Product 1' },
    { barcode: '8901858101101', name: 'Test Product 2' },
    { barcode: '8901858101102', name: 'Test Product 3' },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-on-surface" />
        </button>
        <h1 className="text-on-surface font-poppins font-bold text-2xl">QR Test Codes</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-12">
        {/* Store QR Codes */}
        <section>
          <h2 className="text-on-surface font-poppins font-bold text-xl mb-6">Store QR Codes</h2>
          <p className="text-secondary text-sm mb-6">
            Scan these to test store selection. Use for /scan-store page.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testStores.map((store) => (
              <div
                key={store.id}
                className="bg-white p-6 rounded-lg shadow-md border border-outline/10 flex flex-col items-center"
              >
                <p className="text-on-surface font-poppins font-semibold text-sm mb-4">
                  {store.name}
                </p>
                <QRCodeSVG
                  value={store.id}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-secondary text-xs mt-4 text-center break-all">
                  ID: {store.id}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Barcodes */}
        <section>
          <h2 className="text-on-surface font-poppins font-bold text-xl mb-6">Product Barcodes</h2>
          <p className="text-secondary text-sm mb-6">
            Scan these to test product barcode scanning. Use for /scanner page after selecting store.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testBarcodes.map((product) => (
              <div
                key={product.barcode}
                className="bg-white p-6 rounded-lg shadow-md border border-outline/10 flex flex-col items-center"
              >
                <p className="text-on-surface font-poppins font-semibold text-sm mb-4">
                  {product.name}
                </p>
                <QRCodeSVG
                  value={product.barcode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="text-secondary text-xs mt-4 text-center break-all">
                  Barcode: {product.barcode}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-on-surface font-poppins font-bold text-lg mb-4">How to Use</h3>
          <ol className="text-on-surface space-y-3 text-sm">
            <li>1. <strong>Print or display</strong> these QR codes on another device or paper</li>
            <li>2. <strong>Test Store Scanning:</strong> Navigate to /scan-store and scan store QR codes</li>
            <li>3. <strong>Test Product Scanning:</strong> After selecting store, navigate to /scanner and scan product barcodes</li>
            <li>4. Check console (F12) - should see success logs, no error spam</li>
            <li>5. Verify store info displays after scan</li>
            <li>6. Verify product card displays after barcode scan</li>
          </ol>
        </section>

        {/* Dev Info */}
        <section className="bg-gray-100 border border-gray-300 rounded-lg p-6">
          <h3 className="text-on-surface font-poppins font-bold text-lg mb-4">Dev Info</h3>
          <div className="text-on-surface text-sm space-y-2">
            <p><strong>Test Store ID format:</strong> MongoDB ObjectId (24 hex chars)</p>
            <p><strong>Barcode format:</strong> 13-digit EAN-13 format</p>
            <p><strong>Scanner page:</strong> Requires activeStore selected</p>
            <p><strong>Camera permissions:</strong> Browser will prompt on first scan</p>
            <p><strong>Console:</strong> Check for error spam or success logs</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QRTest;
