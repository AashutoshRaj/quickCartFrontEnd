import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getStaffVerifyPath } from '../app/paths';

/**
 * Staff QR Scanner Page
 * Real camera-based exit QR scan for Security Guards. On a successful
 * decode, hands the raw payload off to StaffVerifyResult (via the route
 * param) which does the actual backend verification.
 */
const StaffScanner: React.FC = (): React.ReactElement => {
  const [scanned, setScanned] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scanned) return;

    const scanner = new Html5QrcodeScanner(
      'staff-qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        if (scanned) return;
        setScanned(true);
        scanner.clear().catch(() => undefined);
        navigate(getStaffVerifyPath(decodedText));
      },
      (error: string) => {
        console.warn('QR scan error:', error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanned]);

  return (
    <div className="h-dvh bg-background flex flex-col px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary font-inter text-sm mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-on-surface font-poppins font-bold text-2xl text-center mb-2">
        Scan Customer Exit QR
      </h1>
      <p className="text-secondary font-inter text-sm text-center mb-8">
        Point the camera at the customer's exit QR code
      </p>

      <div className="bg-white rounded-2xl border border-outline/10 shadow-sm p-4">
        <div id="staff-qr-reader" />
      </div>
    </div>
  );
};

export default StaffScanner;
