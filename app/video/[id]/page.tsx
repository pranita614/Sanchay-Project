import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoPlayer from '@/components/video/VideoPlayer';
import { SEED_VIDEO, ArchivalVideo } from '@/lib/db/seed-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Film, Play } from 'lucide-react';

export default async function VideoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const video = SEED_VIDEO.find(v => v.id === id) || SEED_VIDEO[0];

  if (!video) {
    notFound();
  }

  const relatedVideos = SEED_VIDEO.filter(v => v.id !== video.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E3] font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        {/* BREADCRUMB NAVIGATION */}
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-mono font-bold text-[#062A4A]/80">
            <Link href="/" className="hover:text-[#C9A227]">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#C9A227]" />
            <Link href="/video" className="hover:text-[#C9A227]">Video Archive</Link>
            <ChevronRight className="w-3 h-3 text-[#C9A227]" />
            <span className="text-[#C9A227] truncate max-w-xs sm:max-w-md">{video.title}</span>
          </nav>

          <Link
            href="/video"
            className="inline-flex items-center gap-1.5 text-xs font-serif font-bold text-[#062A4A] bg-white px-3 py-1.5 rounded-lg border border-sanchay-borderCream hover:text-[#C9A227] transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A227]" /> Back to Video Archive
          </Link>
        </div>

        {/* MAIN VIDEO PLAYER COMPONENT */}
        <VideoPlayer video={video} />

        {/* RELATED VIDEOS SECTION (ONLY IF VERIFIED OTHER RECORDS EXIST) */}
        {relatedVideos.length > 0 && (
          <div className="bg-white rounded-xl border border-sanchay-borderCream p-6 shadow-archival space-y-6">
            <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-4">
              <h2 className="text-xl font-serif font-bold text-[#062A4A] flex items-center gap-2">
                <Film className="w-5 h-5 text-[#C9A227]" /> Related Archival Videos
              </h2>
              <Link href="/video" className="text-xs font-mono font-bold text-[#C9A227] hover:underline">
                View All Video Records →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVideos.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-[#FBF8EF] rounded-xl border border-sanchay-borderCream hover:border-[#C9A227] p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-[#062A4A]">
                      <img
                        src={rel.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Link
                          href={`/video/${rel.id}`}
                          className="w-10 h-10 rounded-full bg-[#C9A227] text-[#062A4A] flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </Link>
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#062A4A] text-[#C9A227] text-[9px] font-mono font-bold uppercase">
                        INTERNET ARCHIVE
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#C9A227] font-bold block">{rel.year || 'Archival Film'}</span>
                      <h3 className="text-sm font-serif font-bold text-[#062A4A] group-hover:text-[#C9A227] transition-colors line-clamp-1">
                        <Link href={`/video/${rel.id}`}>{rel.title}</Link>
                      </h3>
                      <p className="text-xs text-[#172B3D]/70 font-sans line-clamp-2 mt-1">
                        {rel.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-sanchay-borderCream flex justify-end">
                    <Link
                      href={`/video/${rel.id}`}
                      className="px-3 py-1 rounded bg-[#062A4A] text-[#C9A227] text-xs font-bold flex items-center gap-1 hover:bg-[#082F52]"
                    >
                      <Play className="w-3 h-3 fill-current" /> Watch Film
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
