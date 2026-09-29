'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Mic, Video, FileText, BookOpen, Clock, ScanLine, Languages, Sparkles, CheckSquare, Users, BarChart3, ShieldAlert, Settings, LogOut } from 'lucide-react';

export default function StaffSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/staff/collections', label: 'Collections', icon: FolderKanban },
    { href: '/staff/documents', label: 'Documents', icon: FileText },
    { href: '/staff/audio', label: 'Audio Speeches', icon: Mic },
    { href: '/staff/video', label: 'Videos', icon: Video },
    { href: '/staff/timeline', label: 'Timeline Events', icon: Clock },
    { href: '/staff/ocr', label: 'OCR Review', icon: ScanLine },
    { href: '/staff/translations', label: 'Translations', icon: Languages },
    { href: '/staff/ai-knowledge', label: 'AI Knowledge Base', icon: Sparkles },
    { href: '/staff/reviews', label: 'Pending Reviews', icon: CheckSquare },
    { href: '/staff/users', label: 'Users & Roles', icon: Users },
    { href: '/staff/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/staff/audit', label: 'Audit Logs', icon: ShieldAlert },
    { href: '/staff/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sanchay-deepNavy text-sanchay-cream min-h-screen border-r border-sanchay-gold/30 flex flex-col justify-between flex-shrink-0">
      
      <div>
        {/* Portal Header */}
        <div className="p-5 border-b border-sanchay-gold/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sanchay-darkNavy border-2 border-sanchay-gold flex items-center justify-center font-serif font-bold text-sanchay-gold">
            S
          </div>
          <div>
            <span className="font-serif font-bold text-sanchay-gold tracking-wide text-base block leading-none">
              Sanchay
            </span>
            <span className="text-[10px] text-sanchay-cream/70 uppercase tracking-wider block mt-1">
              Staff Management Portal
            </span>
          </div>
        </div>

        {/* User Badge */}
        <div className="p-4 bg-sanchay-darkNavy/50 border-b border-sanchay-gold/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center justify-center">
            MM
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Museum Manager</span>
            <span className="text-[10px] text-sanchay-gold font-mono">SUPER_ADMIN</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-sanchay-gold text-sanchay-deepNavy font-bold shadow-sm'
                    : 'text-sanchay-cream/80 hover:bg-sanchay-darkNavy hover:text-sanchay-gold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sanchay-deepNavy' : 'text-sanchay-gold'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-sanchay-gold/20">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded bg-sanchay-darkNavy text-sanchay-gold text-xs font-bold border border-sanchay-gold/30 hover:bg-red-950 hover:text-white hover:border-red-500 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out to Public Portal
        </Link>
      </div>

    </aside>
  );
}
