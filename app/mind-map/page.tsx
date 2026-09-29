'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SEED_MINDMAP, MindNode } from '@/lib/db/seed-data';
import { Network, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MindMapPage() {
  const [selectedNode, setSelectedNode] = useState<MindNode>(SEED_MINDMAP[0]);

  return (
    <div className="min-h-screen flex flex-col bg-sanchay-cream">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-8">
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-sanchay-deepNavy">
            Interactive Knowledge Mind Map
          </h1>
          <p className="text-xs text-sanchay-textMuted mt-2">
            Explore the interconnected thematic domains of Dr. B. R. Ambedkar's philosophical, economic, and constitutional works.
          </p>
        </div>

        {/* Mind Map Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Visual Interactive Map */}
          <div className="lg:col-span-2 bg-sanchay-deepNavy rounded-lg border-2 border-sanchay-gold p-8 shadow-archival min-h-[500px] flex flex-col justify-between relative overflow-hidden">
            
            {/* Background Archival Grid */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Central Node: DR. B. R. AMBEDKAR */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
              <button
                onClick={() => setSelectedNode(SEED_MINDMAP[0])}
                className="w-36 h-36 rounded-full bg-sanchay-gold text-sanchay-deepNavy border-4 border-sanchay-cream shadow-goldGlow flex flex-col items-center justify-center text-center p-2 hover:scale-105 transition-transform"
              >
                <span className="font-serif font-bold text-sm uppercase leading-tight">
                  DR. B. R. AMBEDKAR
                </span>
                <span className="text-[9px] font-mono mt-1 text-sanchay-darkNavy">Central Knowledge Hub</span>
              </button>
            </div>

            {/* Connected Branch Nodes */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-sanchay-gold/30">
              {SEED_MINDMAP.slice(1).map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'bg-sanchay-gold text-sanchay-deepNavy border-white shadow-goldGlow font-bold scale-105'
                        : 'bg-sanchay-darkNavy text-sanchay-cream border-sanchay-gold/40 hover:border-sanchay-gold hover:bg-sanchay-deepNavy'
                    }`}
                  >
                    <span className="text-xs font-serif block">{node.label}</span>
                    <span className="text-[10px] font-mono block mt-1 opacity-80">{node.docCount} Records</span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Node Detail Panel */}
          <div className="bg-white p-6 rounded-lg border border-sanchay-borderCream shadow-archival space-y-4">
            <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30">
                {selectedNode.category}
              </span>
              <span className="text-xs font-mono text-sanchay-gold font-bold">{selectedNode.docCount} Archival Documents</span>
            </div>

            <h2 className="text-xl font-serif font-bold text-sanchay-deepNavy">
              {selectedNode.label}
            </h2>

            <p className="text-xs text-sanchay-textDark leading-relaxed font-sans">
              {selectedNode.description}
            </p>

            <div className="pt-4 border-t border-sanchay-borderCream">
              <Link
                href={`/explore?query=${encodeURIComponent(selectedNode.label)}`}
                className="w-full py-2 px-4 rounded bg-sanchay-deepNavy text-sanchay-gold font-bold text-xs flex items-center justify-center gap-2 hover:bg-sanchay-darkNavy transition-colors"
              >
                <BookOpen className="w-4 h-4" /> Explore Connected Records <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
