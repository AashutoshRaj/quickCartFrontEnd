import React, { useCallback, useEffect, useState } from 'react';
import { Download, Info, Share, Smartphone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const DISMISS_KEY = 'quickcart-install-prompt-dismissed-at';
const DISMISS_FOR_MS = 30 * 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

const isIosDevice = (): boolean => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent)
    || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
};

const isStandalone = (): boolean => {
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true;
};

const getBrowserName = (): string => {
  const userAgent = window.navigator.userAgent;
  if (/SamsungBrowser/i.test(userAgent)) return 'Samsung Internet';
  if (/Edg/i.test(userAgent)) return 'Microsoft Edge';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/CriOS|Chrome/i.test(userAgent)) return 'Chrome';
  return 'your browser';
};

const wasDismissedRecently = (): boolean => {
  const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
  return dismissedAt > 0 && Date.now() - dismissedAt < DISMISS_FOR_MS;
};

const InstallPrompt: React.FC = (): React.ReactElement | null => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showReopenButton, setShowReopenButton] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [browserName, setBrowserName] = useState('your browser');

  const closePrompt = useCallback((remember = true): void => {
    setIsOpen(false);
    setShowInstructions(false);
    if (remember) {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
      setShowReopenButton(true);
    }
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return undefined;

    const ios = isIosDevice();
    const installed = isStandalone();
    setIsIos(ios);
    setIsInstalled(installed);
    setBrowserName(getBrowserName());

    const handleBeforeInstallPrompt = (event: Event): void => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = (): void => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsOpen(false);
      setShowReopenButton(false);
      window.localStorage.removeItem(DISMISS_KEY);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const timer = window.setTimeout(() => {
      if (!installed && !wasDismissedRecently()) setIsOpen(true);
      else if (!installed && wasDismissedRecently()) setShowReopenButton(true);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [location.pathname]);

  const handleInstall = async (): Promise<void> => {
    if (isIos) {
      setShowInstructions(true);
      return;
    }
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        closePrompt(false);
      } else {
        closePrompt(true);
      }
      return;
    }
    setShowInstructions(true);
  };

  if (isInstalled || location.pathname.startsWith('/admin')) return null;

  return (
    <>
      {!isOpen && showReopenButton && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-[#FFB800] px-4 py-3 text-sm font-bold text-[#0f1c2c] shadow-lg shadow-amber-900/20 transition-transform hover:-translate-y-0.5"
          aria-label="Open QuickCart installation instructions"
        >
          <Download size={17} />
          Install app
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-[#0f1c2c]/45 p-4 sm:items-center"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => { if (event.target === event.currentTarget) closePrompt(true); }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="install-quickcart-title"
              className="w-full max-w-sm overflow-hidden rounded-[28px] bg-[#f8f9ff] shadow-2xl"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            >
              <div className="relative px-6 pb-6 pt-7 text-center">
                <button type="button" onClick={() => closePrompt(true)} className="absolute right-4 top-4 rounded-full p-2 text-[#525f71] hover:bg-white" aria-label="Close installation popup"><X size={18} /></button>
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFB800] shadow-lg shadow-amber-900/15"><img src="/quickcart-icon.svg" alt="QuickCart" className="h-11 w-11" /></div>
                <h2 id="install-quickcart-title" className="font-poppins text-xl font-bold text-[#0f1c2c]">Add QuickCart to your Home Screen</h2>
                <p className="mt-3 text-sm leading-6 text-[#525f71]">Shop faster and access QuickCart anytime. Add QuickCart to your home screen for a convenient app-like experience.</p>

                {showInstructions ? (
                  <div className="mt-5 rounded-2xl bg-white p-4 text-left text-sm text-[#525f71] shadow-sm">
                    <div className="mb-3 flex items-center gap-2 font-bold text-[#0f1c2c]"><Info size={18} className="text-[#FFB800]" />Installation steps</div>
                    {isIos ? (
                      <ol className="list-decimal space-y-2 pl-5"><li>Open QuickCart in Safari.</li><li>Tap the Share button.</li><li>Choose “Add to Home Screen”.</li><li>Tap “Add”.</li></ol>
                    ) : (
                      <ol className="list-decimal space-y-2 pl-5"><li>Open the {browserName} menu.</li><li>{browserName === 'Samsung Internet' ? 'Choose “Add page to” and then “Home screen”.' : browserName === 'Firefox' ? 'Choose “Install” or “Add to Home screen”.' : browserName === 'Microsoft Edge' ? 'Choose “Add to phone” or “Install”.' : 'Choose “Install app” or “Add to Home screen”.'}</li><li>Confirm the installation.</li></ol>
                    )}
                    <p className="mt-3 text-xs text-[#525f71]">Your browser controls this installation, so QuickCart will not report success until the app is actually installed.</p>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-[#525f71]"><Smartphone size={16} className="text-[#FFB800]" />A fast, app-like shopping experience</div>
                )}

                <button type="button" onClick={() => { void handleInstall(); }} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFB800] px-5 py-3.5 font-bold text-[#0f1c2c] shadow-md shadow-amber-900/15 transition hover:bg-[#f2aa00] active:scale-[0.98]">
                  {isIos || showInstructions ? <Share size={18} /> : <Download size={18} />}
                  {isIos || showInstructions ? 'View Installation Steps' : 'Add to Home Screen'}
                </button>
                <button type="button" onClick={() => closePrompt(true)} className="mt-3 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-[#525f71] hover:bg-white">Maybe Later</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallPrompt;
