import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckCircle2, AlertCircle, LogOut, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OrderItem {
  name?: string;
  productName?: string;
  price?: number;
  quantity: number;
}

interface OrderData {
  sessionId?: string;
  items?: OrderItem[];
  totalAmount?: number;
  [key: string]: unknown;
}

/**
 * Exit Gate Page Component
 * Handles QR code scanning at exit gate for order verification
 * Displays order details and confirms customer exit
 *
 * @returns {React.ReactElement} Exit gate scanner or order verification page
 */
const ExitGate: React.FC = (): React.ReactElement => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [exited, setExited] = useState<boolean>(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scanned || exited) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        handleQRScan(decodedText, scanner);
      },
      (error: Error) => {
        console.warn('QR scan error:', error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch((err: Error) => console.log('Scanner cleanup:', err));
    };
  }, [scanned, exited]);

  const handleQRScan = async (qrData: string, scanner: Html5QrcodeScanner): Promise<void> => {
    try {
      setScanned(true);
      if (scanner) {
        await scanner.pause();
      }

      setLoading(true);

      const sessionId = qrData.includes('session_id=')
        ? new URLSearchParams(qrData.split('?')[1]).get('session_id')
        : qrData;

      const response = await fetch(`/api/v1/checkout/order/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const data: { data: OrderData } = await response.json();
      setOrderData(data.data || data);
      toast.success('Order found ✓');
    } catch (error) {
      console.error('QR scan error:', error);
      toast.error('Invalid QR code or order not found');
      setScanned(false);
      if (scanner) {
        scanner.resume();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (): Promise<void> => {
    try {
      setLoading(true);

      await fetch(`/api/v1/checkout/exit/${orderData?.sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ exitedAt: new Date().toISOString() }),
      });

      setExited(true);
      toast.success('Exit confirmed! Thank you for shopping.');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Exit error:', error);
      toast.error('Failed to confirm exit');
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setScanned(false);
    setOrderData(null);
  };

  // Success state
  if (exited) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle2 className="mx-auto w-16 h-16 text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-green-900 mb-2">Exit Confirmed!</h1>
          <p className="text-green-700">Thank you for shopping at QuickCart</p>
        </div>
      </div>
    );
  }

  // Order details view
  if (orderData && scanned) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Order Verification</h1>
                <p className="text-sm text-gray-600">Security Gate Inspection</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Order ID: <span className="font-bold text-gray-900">{orderData.sessionId?.slice(0, 12)}</span></p>
              <p className="text-sm text-gray-600">Items: <span className="font-bold text-gray-900">{orderData.items?.length || 0}</span></p>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Items in Order</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item: OrderItem, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name || item.productName}</p>
                      <p className="text-sm text-gray-600">Price: ${item.price?.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
                      x{item.quantity}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">${orderData.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleExit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-4 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {loading ? 'Processing...' : 'Confirm Exit'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50 font-bold py-3 px-4 rounded-2xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Scanner view
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Instructions */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Exit Gate Scanner</h1>
          <p className="text-gray-300">Scan QR code to verify order</p>
        </div>

        {/* Scanner Box */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-2xl">
          <div id="qr-reader" className="w-full" />
        </div>

        {/* Info */}
        <div className="bg-blue-900/30 border border-blue-500 rounded-2xl p-4 text-center">
          <AlertCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-blue-200 text-sm">
            Position the QR code from payment receipt within the scanner frame
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExitGate;
