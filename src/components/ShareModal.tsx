import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, QrCode, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://abubakr-birthday.app';
  const shareTitle = "🎉 Happy Birthday Abubakr! 🎂";
  const shareText = `Today is our beloved cousin Abubakr's Birthday! 🎈 Check out his special celebration website with memory photos, birthday song, cake cutting, and leave him a warm wish: ${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    audioEngine.playChime();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 text-center shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="text-2xl font-bold text-white font-display mb-1">
          Share Abubakr’s Celebration
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-6">
          Spread the joy! Send this special website to family and friends so everyone can wish Abubakr.
        </p>

        {/* Action Buttons Grid */}
        <div className="space-y-3">
          {/* Primary WhatsApp Action */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Share to WhatsApp Group</span>
          </button>

          {/* Native Web Share Sheet (for iOS / Android) */}
          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>More Sharing Options</span>
            </button>
          )}

          {/* Copy Link Row */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 pl-3 text-left">
            <span className="text-xs text-slate-400 truncate flex-1 font-mono">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Toggle QR Code */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center justify-center gap-1.5 mx-auto pt-2 hover:underline cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>{showQR ? 'Hide QR Code' : 'Scan QR Code at Party'}</span>
          </button>

          {/* QR Code view */}
          {showQR && (
            <div className="mt-4 p-4 rounded-2xl bg-white text-slate-950 inline-block shadow-xl animate-fadeIn">
              {/* Clean decorative QR simulation with clear center logo */}
              <div className="w-44 h-44 bg-slate-100 p-2 rounded-xl border border-slate-300 flex flex-col items-center justify-center relative">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                  alt="QR Code to Abubakr's Birthday Website"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to stylized SVG QR if offline
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[10px] text-slate-600 font-semibold mt-1">
                  Scan with Phone Camera
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Made with love for Abubakr</span>
        </div>
      </div>
    </div>
  );
};
