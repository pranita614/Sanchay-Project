'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { verifyStaffCredentials } from '@/lib/auth/session';

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@sanchay.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = verifyStaffCredentials(email, password);
    if (user) {
      router.push('/staff/dashboard');
    } else {
      setError('Invalid staff credentials. Default dev pass: admin');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanchay-deepNavy flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Archival Overlay matching Screen 9 */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Back to Public Site Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-sanchay-gold hover:text-white text-xs font-bold flex items-center gap-1 bg-sanchay-darkNavy px-3 py-1.5 rounded border border-sanchay-gold/40 z-20"
      >
        <ArrowLeft className="w-4 h-4" /> Public Portal
      </Link>

      {/* Main Staff Login Box (Screen 9 Target) */}
      <div className="relative z-10 bg-white rounded-lg border-2 border-sanchay-gold shadow-goldGlow p-8 max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-sanchay-darkNavy border-2 border-sanchay-gold flex items-center justify-center mx-auto shadow-sm">
            <span className="text-sanchay-gold font-serif font-bold text-2xl">S</span>
          </div>

          <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">
            Sanchay
          </h1>
          <h2 className="text-sm font-serif font-bold text-sanchay-gold">
            Staff Login
          </h2>
          <p className="text-[11px] text-sanchay-textMuted font-sans">
            Authorized museum staff and curators only
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-serif font-bold text-sanchay-deepNavy block mb-1">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sanchay-textMuted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your official email"
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-textDark focus:outline-none focus:border-sanchay-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-serif font-bold text-sanchay-deepNavy block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sanchay-textMuted absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (dev: admin)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-textDark focus:outline-none focus:border-sanchay-gold font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 text-sanchay-textMuted cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-sanchay-gold rounded" />
              <span>Keep me signed in</span>
            </label>
            <a href="#" className="text-sanchay-darkNavy font-bold hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-sanchay-deepNavy text-sanchay-gold font-bold text-xs hover:bg-sanchay-darkNavy transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Login to Staff Portal'}
          </button>
        </form>

        <div className="pt-4 border-t border-sanchay-borderCream text-center text-[10px] text-sanchay-textMuted font-mono">
          SANCHAY Staff Portal • Role-Based Access Control Active
        </div>

      </div>

    </div>
  );
}
