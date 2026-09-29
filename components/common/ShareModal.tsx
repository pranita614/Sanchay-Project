'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Twitter, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export default function ShareModal({ isOpen, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://sanchay.archive.gov.in');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQR = async () => {
    try {
      const dataUri = await QRCode.toDataURL(currentUrl, { width: 200, margin: 2 });
      setQrDataUrl(dataUri);
      setShowQr(!showQr);
    } catch (err) {
      console.error(err);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Explore "${title}" on SANCHAY Digital Heritage Archive of Dr. B. R. Ambedkar:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Explore "${title}" on SANCHAY Digital Heritage Archive of Dr. B. R. Ambedkar:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border-2 border-sanchay-gold shadow-goldGlow max-w-md w-full p-6 relative space-y-5 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
          <h3 className="font-serif font-bold text-sanchay-deepNavy text-base flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sanchay-gold" /> Share Archival Record
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-sanchay-textMuted hover:text-sanchay-deepNavy hover:bg-sanchay-cream"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-sanchay-textDark font-sans">
          <strong>{title}</strong>
        </div>

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={shareWhatsApp}
            className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-green-600" /> WhatsApp
          </button>

          <button
            onClick={shareTwitter}
            className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
          >
            <Twitter className="w-5 h-5 text-blue-600" /> Twitter / X
          </button>

          <button
            onClick={generateQR}
            className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex flex-col items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <QrCode className="w-5 h-5 text-sanchay-gold" /> QR Code
          </button>
        </div>

        {/* QR Code Display Frame */}
        {showQr && qrDataUrl && (
          <div className="bg-sanchay-cream p-4 rounded border border-sanchay-gold/40 flex flex-col items-center justify-center space-y-2">
            <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 border border-sanchay-gold rounded" />
            <span className="text-[10px] font-mono text-sanchay-deepNavy">Scan to view on mobile terminal</span>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-sanchay-textMuted block">Direct Archival URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 p-2 text-xs rounded border border-sanchay-borderCream bg-sanchay-creamLight font-mono text-sanchay-textDark focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 rounded bg-sanchay-deepNavy text-sanchay-gold text-xs font-bold flex items-center gap-1 hover:bg-sanchay-darkNavy transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
