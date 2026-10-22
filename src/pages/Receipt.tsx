import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Download, Loader2, ShoppingBag } from 'lucide-react';
import QRCode from 'qrcode';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios.ts';
import { formatCurrency } from '../utils/currency.ts';
import { PATHS } from '../app/paths';

interface ReceiptItem {
  name?: string;
  productName?: string;
  price?: number;
  unitPrice?: number;
  quantity: number;
  subtotal?: number;
}

interface ReceiptOrder {
  _id?: string;
  storeName?: string;
  storeAddress?: string;
  storeLogo?: string;
  currency?: string;
  items?: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  taxRate?: number;
  taxExclusiveAmount?: number;
  discount?: number;
  total?: number;
  totalAmount?: number;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
  paidAt?: string;
  completedAt?: string;
  exitQrToken?: string;
}

const Receipt: React.FC = (): React.ReactElement => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [order, setOrder] = useState<ReceiptOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadReceipt = async (): Promise<void> => {
      if (!sessionId) {
        setError('This receipt link is missing its order reference.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await apiClient.get(`/checkout/order/${encodeURIComponent(sessionId)}`);
        if (active) setOrder(response.data.data as ReceiptOrder);
      } catch {
        if (active) setError('We could not load this paid receipt. Please try again from Order History.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadReceipt();
    return () => { active = false; };
  }, [sessionId]);

  useEffect(() => {
    if (!qrCanvasRef.current || !order?.exitQrToken) return;
    void QRCode.toCanvas(qrCanvasRef.current, order.exitQrToken, {
      width: 180,
      margin: 1,
      color: { dark: '#111827', light: '#FFFFFF' },
    });
  }, [order]);

  const currency = order?.currency || 'AED';
  const totalPaid = Number(order?.totalAmount ?? order?.total ?? 0);
  const taxRate = Number(order?.taxRate ?? 5);
  const taxIncluded = Number(order?.tax ?? (totalPaid - totalPaid / (1 + taxRate / 100)));
  const taxExclusive = Number(order?.taxExclusiveAmount ?? (totalPaid - taxIncluded));
  const purchaseDate = useMemo(() => {
    const timestamp = order?.paidAt || order?.completedAt || order?.createdAt;
    return timestamp ? new Date(timestamp).toLocaleString('en-AE') : '—';
  }, [order]);
  const money = (value: number): string => formatCurrency(value, currency);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mr-2" />Loading receipt…</div>;
  }

  if (error || !order || order.paymentStatus !== 'completed') {
    return <div className="min-h-screen flex items-center justify-center px-5 text-center"><div><p className="text-red-600 font-semibold mb-4">{error || 'This receipt is not available until payment is completed.'}</p><button onClick={() => navigate(PATHS.HISTORY)} className="text-primary font-bold">Go to Order History</button></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 print:bg-white print:p-0">
      <div className="max-w-md mx-auto print:max-w-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-700 font-semibold"><ArrowLeft size={18} />Back</button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 font-bold"><Download size={17} />Print / Save</button>
        </div>

        <article className="receipt-paper bg-white text-gray-900 shadow-xl px-6 py-7 sm:px-8 print:shadow-none print:px-0 print:py-0">
          <header className="text-center border-b border-dashed border-gray-300 pb-5">
            {order.storeLogo ? <img src={order.storeLogo} alt="" className="mx-auto h-12 w-12 object-contain mb-2" /> : <ShoppingBag className="mx-auto mb-2" size={28} />}
            <h1 className="text-2xl font-black tracking-tight">{order.storeName || 'QuickCart'}</h1>
            {order.storeAddress && <p className="text-xs text-gray-500 mt-1">{order.storeAddress}</p>}
            <p className="text-[11px] text-gray-500 mt-3">RECEIPT • {order._id ? `#${order._id.slice(-8).toUpperCase()}` : '—'}</p>
            <p className="text-[11px] text-gray-500">{purchaseDate}</p>
          </header>

          <section className="py-4 border-b border-dashed border-gray-300 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-semibold">{order._id || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-semibold capitalize">{order.paymentMethod || 'Card'} • Paid</span></div>
          </section>

          <section className="py-4 border-b border-dashed border-gray-300">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3"><span>Item</span><span>Qty</span><span>Total</span></div>
            <div className="space-y-3">
              {(order.items || []).map((item, index) => {
                const unitPrice = Number(item.price ?? item.unitPrice ?? 0);
                const lineTotal = Number(item.subtotal ?? unitPrice * item.quantity);
                return <div key={`${item.productName || item.name || 'item'}-${index}`} className="grid grid-cols-[1fr_auto_auto] gap-3 text-sm"><span className="min-w-0 break-words">{item.name || item.productName || 'Product'}<small className="block text-xs text-gray-500">{money(unitPrice)} each</small></span><span>{item.quantity}</span><span className="font-semibold">{money(lineTotal)}</span></div>;
              })}
            </div>
          </section>

          <section className="py-4 border-b border-dashed border-gray-300 text-sm space-y-2">
            <div className="flex justify-between"><span>Subtotal <span className="text-xs text-gray-500">(VAT included)</span></span><span>{money(Number(order.subtotal ?? totalPaid))}</span></div>
            {Number(order.discount || 0) > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{money(Number(order.discount))}</span></div>}
            <div className="flex justify-between text-gray-600"><span>Amount before VAT</span><span>{money(taxExclusive)}</span></div>
            <div className="flex justify-between text-gray-600"><span>VAT included ({taxRate}%)</span><span>{money(taxIncluded)}</span></div>
            <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-200"><span>Total Paid</span><span>{money(totalPaid)}</span></div>
          </section>

          <section className="text-center pt-5">
            <p className="text-xs font-black tracking-widest mb-3">SCAN TO VERIFY EXIT</p>
            <canvas ref={qrCanvasRef} className="mx-auto border-4 border-white" aria-label="Secure exit verification QR code" />
            <p className="text-[11px] text-gray-500 mt-3">Show this secure code to an authorized QuickCart staff member.</p>
            <p className="text-sm font-semibold mt-5">Thank you for shopping with QuickCart!</p>
          </section>
        </article>

        <div className="mt-4 text-center print:hidden"><Link to={PATHS.HISTORY} className="text-primary font-bold text-sm">View in Order History</Link></div>
      </div>
    </div>
  );
};

export default Receipt;
