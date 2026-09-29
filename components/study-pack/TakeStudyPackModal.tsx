'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Mail, Copy, Check, Send, Loader2, ExternalLink, Smartphone } from 'lucide-react';
import { StudyPackItem } from '@/lib/study-pack/store';

interface TakeStudyPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: StudyPackItem[];
}

export default function TakeStudyPackModal({ isOpen, onClose, items }: TakeStudyPackModalProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'email'>('qr');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [mobileShareUrl, setMobileShareUrl] = useState<string>('');
  const [shareToken, setShareToken] = useState<string>('');
  const [qrImageDataUrl, setQrImageDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Email form state
  const [emailInput, setEmailInput] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mailtoUrl, setMailtoUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && items.length > 0 && !shareUrl) {
      generateShareToken();
    }
  }, [isOpen, items]);

  const generateShareToken = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/study-pack/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, title: 'My SANChAY Study Pack' }),
      });
      const data = await res.json();

      if (data.success) {
        setShareUrl(data.shareUrl);
        const qrUrlTarget = data.mobileShareUrl || data.shareUrl;
        setMobileShareUrl(qrUrlTarget);
        setShareToken(data.shareToken);

        // Generate QR code data URL using mobile LAN IP URL so mobile camera scans work!
        const dataUrl = await QRCode.toDataURL(qrUrlTarget, {
          width: 260,
          margin: 2,
          color: {
            dark: '#062A4A',
            light: '#FFFFFF',
          },
        });
        setQrImageDataUrl(dataUrl);
      }
    } catch (err) {
      console.error('Failed to generate share link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      setEmailSending(true);
      setEmailError('');

      let currentShareUrl = shareUrl;
      let currentShareToken = shareToken;

      if (!currentShareUrl) {
        const res = await fetch('/api/study-pack/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, title: 'My SANChAY Study Pack' }),
        });
        const data = await res.json();
        currentShareUrl = data.shareUrl;
        currentShareToken = data.shareToken;
        setShareUrl(data.shareUrl);
        setShareToken(data.shareToken);
      }

      const res = await fetch('/api/study-pack/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: emailInput,
          shareUrl: currentShareUrl,
          shareToken: currentShareToken,
          items: items.map((i) => ({ title: i.title, itemType: i.itemType, url: i.url })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEmailSentSuccess(true);
        if (data.mailtoUrl) {
          setMailtoUrl(data.mailtoUrl);
        }
      } else {
        setEmailError(data.error || 'Failed to send email. Please try again.');
      }
    } catch (err: any) {
      setEmailError(err.message || 'Error sending email.');
    } finally {
      setEmailSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border-2 border-sanchay-gold text-sanchay-deepNavy rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        
        {/* Header Banner */}
        <div className="px-6 py-4 border-b border-sanchay-borderCream flex items-center justify-between bg-sanchay-deepNavy text-white">
          <div>
            <h3 className="text-lg font-serif font-bold text-sanchay-gold">Take My Study Pack</h3>
            <p className="text-xs text-sanchay-cream/80 mt-0.5 font-sans">
              Share or export your collection ({items.length} items)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sanchay-cream/70 hover:text-white hover:bg-sanchay-darkNavy transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Off-White Theme */}
        <div className="flex border-b border-sanchay-borderCream bg-sanchay-cream">
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'border-sanchay-gold text-sanchay-deepNavy bg-white shadow-xs'
                : 'border-transparent text-sanchay-textMuted hover:text-sanchay-deepNavy'
            }`}
          >
            <QrCode className="w-4 h-4 text-sanchay-gold" />
            <span>Generate QR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 text-xs font-bold font-serif flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'email'
                ? 'border-sanchay-gold text-sanchay-deepNavy bg-white shadow-xs'
                : 'border-transparent text-sanchay-textMuted hover:text-sanchay-deepNavy'
            }`}
          >
            <Mail className="w-4 h-4 text-sanchay-gold" />
            <span>Send Email</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 bg-sanchay-cream/40">
          
          {/* TAB 1: GENERATE QR */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center text-center space-y-4">
              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-sanchay-gold animate-spin" />
                  <p className="text-xs text-sanchay-textMuted font-medium">Generating Mobile QR Code...</p>
                </div>
              ) : qrImageDataUrl ? (
                <>
                  <div className="p-3.5 bg-white rounded-xl shadow-archival border-2 border-sanchay-gold">
                    <img src={qrImageDataUrl} alt="Study Pack QR Code" className="w-48 h-48 object-contain" />
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs text-sanchay-textDark font-sans">
                    <Smartphone className="w-4 h-4 text-sanchay-gold shrink-0" />
                    <span>Scan with mobile phone camera (LAN & Wi-Fi ready)</span>
                  </div>

                  {/* URL Input & Controls */}
                  <div className="w-full pt-2 flex items-center gap-2 bg-white p-2 rounded-xl border border-sanchay-borderCream shadow-xs">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="bg-transparent text-xs text-sanchay-deepNavy font-mono flex-1 px-2 outline-none overflow-hidden text-ellipsis"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold rounded-lg flex items-center gap-1.5 hover:bg-sanchay-goldLight transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-sanchay-deepNavy text-sanchay-gold rounded-lg hover:bg-sanchay-darkNavy transition-colors cursor-pointer shrink-0"
                      title="Open Shared Pack Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={generateShareToken}
                  className="px-4 py-2 bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold rounded-lg shadow-sm"
                >
                  Generate QR Code
                </button>
              )}
            </div>
          )}

          {/* TAB 2: SEND EMAIL */}
          {activeTab === 'email' && (
            <div>
              {emailSentSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 mx-auto flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-serif font-bold text-sanchay-deepNavy">Email Dispatched Successfully!</h4>
                  <p className="text-xs text-sanchay-textDark max-w-xs mx-auto font-sans leading-relaxed">
                    Your Study Pack link with {items.length} items has been generated for <span className="text-sanchay-deepNavy font-bold">{emailInput}</span>.
                  </p>

                  {mailtoUrl && (
                    <a
                      href={mailtoUrl}
                      className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold rounded-xl shadow-goldGlow hover:bg-sanchay-goldLight transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Email App (1-Click Send)</span>
                    </a>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailSentSuccess(false);
                        setEmailInput('');
                      }}
                      className="px-4 py-1.5 bg-white border border-sanchay-borderCream text-sanchay-deepNavy text-xs font-bold rounded-lg hover:bg-sanchay-cream cursor-pointer"
                    >
                      Send to another email
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-serif font-bold text-sanchay-deepNavy mb-1.5">
                      Recipient Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ahirepranita638@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-sanchay-borderCream rounded-lg text-xs text-sanchay-deepNavy placeholder-sanchay-textMuted focus:outline-none focus:border-sanchay-gold shadow-xs font-sans"
                    />
                  </div>

                  {emailError && (
                    <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
                      {emailError}
                    </p>
                  )}

                  <div className="p-3 bg-white rounded-lg border border-sanchay-borderCream text-xs text-sanchay-textDark space-y-1 shadow-xs font-sans">
                    <p className="font-bold text-sanchay-deepNavy font-serif">Included in email:</p>
                    <p>• Unique access link to view this study pack</p>
                    <p>• Full list of {items.length} archival items and direct resource links</p>
                  </div>

                  <button
                    type="submit"
                    disabled={emailSending}
                    className="w-full py-2.5 bg-sanchay-gold text-sanchay-deepNavy text-xs font-bold rounded-lg hover:bg-sanchay-goldLight transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                  >
                    {emailSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Email...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Study Pack Email</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
