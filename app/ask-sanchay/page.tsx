import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AskSanchayChat from '@/components/ai/AskSanchayChat';

export default function AskSanchayPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <AskSanchayChat />
      </main>

      <Footer />
    </div>
  );
}
