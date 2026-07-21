/**
 * Store QR Code Display Component
 * Shows QR code, download, print, and copy options for store
 */

import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Copy, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface StoreQRCodeProps {
  storeId: string;
  storeName: string;
  qrCodeDataURL?: string;
  onRegenerate?: () => Promise<void>;
}

export const StoreQRCode: React.FC<StoreQRCodeProps> = ({
  storeId,
  storeName,
  qrCodeDataURL,
  onRegenerate,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const storeLink = `https://quickcart.app/store/${storeId}`;

  const handleDownloadPNG = (): void => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${storeName}-qr-code.png`;
        link.click();
        toast.success('QR Code downloaded as PNG');
      }
    }
  };

  const handleDownloadSVG = (): void => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg') as SVGElement;
      if (svg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${storeName}-qr-code.svg`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success('QR Code downloaded as SVG');
      }
    }
  };

  const handlePrint = (): void => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const printWindow = window.open('', '', 'width=600,height=700');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print QR Code - ${storeName}</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    margin: 0;
                  }
                  .container {
                    text-align: center;
                  }
                  h1 {
                    margin-bottom: 10px;
                    font-size: 24px;
                  }
                  p {
                    margin: 5px 0;
                    color: #666;
                  }
                  img {
                    margin: 30px 0;
                    border: 2px solid #ddd;
                    padding: 10px;
                    max-width: 400px;
                  }
                  @media print {
                    body {
                      padding: 20px;
                    }
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>${storeName}</h1>
                  <p>Scan this QR Code to visit our store</p>
                  <img src="${canvas.toDataURL()}" alt="Store QR Code" />
                  <p style="font-size: 12px; margin-top: 30px;">${storeLink}</p>
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          toast.success('Print dialog opened');
        }
      }
    }
  };

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(storeLink);
    toast.success('Store link copied to clipboard');
  };

  const handleRegenerate = async (): Promise<void> => {
    if (!onRegenerate) return;

    setIsRegenerating(true);
    try {
      await onRegenerate();
      toast.success('QR Code regenerated');
    } catch (error) {
      toast.error('Failed to regenerate QR Code');
      console.error('QR regeneration error:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="flex justify-center bg-white p-8 rounded-lg border">
        <div ref={qrRef}>
          <QRCodeSVG
            value={storeLink}
            size={256}
            level="H"
            includeMargin
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Store Link Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Store Link:</p>
        <p className="text-sm font-mono break-all text-gray-900">{storeLink}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={handleDownloadPNG}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Download size={16} />
          <span className="hidden sm:inline">PNG</span>
        </button>

        <button
          onClick={handleDownloadSVG}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          <Download size={16} />
          <span className="hidden sm:inline">SVG</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          <Printer size={16} />
          <span className="hidden sm:inline">Print</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          <Copy size={16} />
          <span className="hidden sm:inline">Copy</span>
        </button>
      </div>

      {/* Regenerate Button */}
      {onRegenerate && (
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <RotateCw size={16} />
          {isRegenerating ? 'Regenerating...' : 'Regenerate QR Code'}
        </button>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> This QR Code contains only your Store ID. Customers can scan it from anywhere to access your store information on the QuickCart Customer App.
        </p>
      </div>
    </div>
  );
};

export default StoreQRCode;
