import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DocumentViewer from '@/components/document/DocumentViewer';
import { SEED_DOCUMENTS } from '@/lib/db/seed-data';
import { notFound } from 'next/navigation';

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = SEED_DOCUMENTS.find(d => d.id === id || d.slug === id) || SEED_DOCUMENTS[0];

  if (!doc) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <DocumentViewer document={doc} />
      </main>

      <Footer />
    </div>
  );
}
