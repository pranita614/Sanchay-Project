'use client';

import React, { useState } from 'react';
import StaffSidebar from '@/components/staff/Sidebar';
import { Users, Plus, ShieldCheck, UserCheck, Trash2, X } from 'lucide-react';

export default function StaffUsersPage() {
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Museum Manager', email: 'manager@sanchay.in', role: 'SUPER_ADMIN', department: 'Archival Management', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Dr. Ramakant More', email: 'rmore@sanchay.in', role: 'CURATOR', department: 'Historical Manuscripts', status: 'ACTIVE' },
    { id: 'usr-3', name: 'Sujata Kamble', email: 'sujata@sanchay.in', role: 'TRANSLATOR', department: 'Multilingual Verification', status: 'ACTIVE' },
    { id: 'usr-4', name: 'Anil Thorat', email: 'athorat@sanchay.in', role: 'ARCHIVIST', department: 'Audio & Sound Archives', status: 'ACTIVE' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'CURATOR', department: 'Archival Staff' });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setUsers([...users, { id: `usr-${Date.now()}`, name: formData.name, email: formData.email, role: formData.role, department: formData.department, status: 'ACTIVE' }]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: 'CURATOR', department: 'Archival Staff' });
  };

  return (
    <div className="flex min-h-screen bg-sanchay-cream">
      <StaffSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sanchay-borderCream pb-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-sanchay-deepNavy">Staff Users & Access Roles</h1>
            <p className="text-xs text-sanchay-textMuted mt-1">
              Manage institution staff accounts, permission levels, and curator access
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-sanchay-gold text-sanchay-deepNavy font-bold text-xs flex items-center gap-2 hover:bg-sanchay-goldLight shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-sanchay-borderCream shadow-archival overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-sanchay-deepNavy text-sanchay-gold uppercase font-serif text-[10px] tracking-wider border-b border-sanchay-gold/30">
              <tr>
                <th className="p-3.5">Staff Name & Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sanchay-borderCream font-sans">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-sanchay-cream/40 transition-colors">
                  <td className="p-3.5 font-serif font-bold text-sanchay-deepNavy">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-sanchay-gold text-sanchay-deepNavy font-bold text-[10px] flex items-center justify-center">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="block">{u.name}</span>
                        <span className="text-[10px] text-sanchay-textMuted font-mono block">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-sanchay-gold font-bold">
                    <span className="px-2 py-0.5 rounded bg-sanchay-deepNavy text-sanchay-gold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-sanchay-textMuted">{u.department}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border-2 border-sanchay-gold max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-base font-serif font-bold text-sanchay-deepNavy">Add Staff Account</h2>
                <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Institutional Email *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border rounded font-mono" />
                </div>
                <div>
                  <label className="block font-bold mb-1">Role</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded font-bold">
                    <option value="CURATOR">Curator</option>
                    <option value="ARCHIVIST">Archivist</option>
                    <option value="TRANSLATOR">Translator</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-sanchay-gold text-sanchay-deepNavy font-bold rounded">Create Staff User</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
