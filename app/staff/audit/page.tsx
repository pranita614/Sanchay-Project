'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import dbStore from '@/lib/db/prisma';
import { ShieldAlert, Search, Filter, Clock, CheckCircle } from 'lucide-react';

export default function StaffAuditPage() {
  const [logs] = useState(dbStore.auditLogs);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Security Audit Logs & Provenance Trail</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Immutable institutional audit trail of item publications, edits, staff logins, and RAG index updates
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-sanchay-borderCream shadow-archival flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search audit logs by action or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sanchay-borderCream bg-sanchay-creamLight text-sanchay-deepNavy font-medium focus:outline-none focus:border-sanchay-gold"
            />
            <Search className="w-4 h-4 text-sanchay-gold absolute left-3 top-2.5" />
          </div>

          <div className="text-xs font-mono text-sanchay-textMuted bg-sanchay-cream px-3 py-2 rounded-lg border border-sanchay-borderCream">
            Logged Events: <strong>{filteredLogs.length}</strong>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Action Type</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">Event Details</th>
                <th className="p-3.5">User ID</th>
                <th className="p-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-sanchay-deepNavy font-bold">{log.resource}</td>
                  <td className="p-3.5 text-sanchay-deepNavy">{log.details}</td>
                  <td className="p-3.5 font-mono text-sanchay-textMuted">{log.userId}</td>
                  <td className="p-3.5 text-right font-mono text-sanchay-textMuted">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
