import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { SEED_AUDIO } from '@/lib/db/seed-data';

export default async function AudioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audio = SEED_AUDIO.find(a => a.id === id) || SEED_AUDIO[0];

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <AudioPlayer audio={audio} />
      </main>

      <Footer />
    </div>
  );
}
