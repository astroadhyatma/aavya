import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'hero' | 'floating' }> = ({
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedNotice, setInstalledNotice] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstalledNotice(true);
      setTimeout(() => setInstalledNotice(false), 3000);
    }
  };

  if (isInstallable) {
    if (variant === 'hero') {
      return (
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 text-emerald-800" />
          <span>Install App (APK/PWA)</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-[#E8F3EB] hover:bg-[#D5EBDC] border border-[#BFDFCA] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        title="Install AAVYA directly on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-[#E8F3EB] hover:bg-[#D5EBDC] border border-[#BFDFCA] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install on iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 relative space-y-4">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-serif font-bold text-lg text-[#192A24]">
                Install AAVYA on iPhone / iPad
              </h3>
              <div className="text-xs text-neutral-600 space-y-2">
                <p>1. Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.</p>
                <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                <p>3. Tap <strong>Add</strong> at top right to launch AAVYA as a standalone full-screen app.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 text-xs font-bold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#23533E] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
