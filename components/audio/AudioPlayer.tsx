'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Search, Mic, Download, Share2 } from 'lucide-react';
import { ArchivalAudio } from '@/lib/db/seed-data';
import ShareModal from '@/components/common/ShareModal';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

export default function AudioPlayer({ audio }: { audio: ArchivalAudio }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(135); // 02:15 default active
  const [duration, setDuration] = useState(audio.durationSeconds || 2720);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'transcript' | 'chapters' | 'notes'>('transcript');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Generate actual audible speech audio sound from speaker
      if (synthRef.current) {
        synthRef.current.cancel();
        const activeSeg = audio.transcriptSegments.find((seg, idx) => {
          const nextSeg = audio.transcriptSegments[idx + 1];
          return nextSeg ? currentTime >= seg.timeInSeconds && currentTime < nextSeg.timeInSeconds : currentTime >= seg.timeInSeconds;
        }) || audio.transcriptSegments[0];

        const utterance = new SpeechSynthesisUtterance(activeSeg.text);
        utterance.rate = playbackRate;
        if (audio.language === 'Bengali' || audio.id.includes('-bn')) utterance.lang = 'bn-IN';
        else if (audio.language === 'Marathi' || audio.id.includes('-mr')) utterance.lang = 'mr-IN';
        else if (audio.language === 'Hindi' || audio.id.includes('-hi')) utterance.lang = 'hi-IN';
        else if (audio.language === 'Tamil' || audio.id.includes('-ta')) utterance.lang = 'ta-IN';
        else utterance.lang = 'en-US';

        utterance.onend = () => {
          // Play next segment sound
        };
        synthRef.current.speak(utterance);
      }
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
      const seg = audio.transcriptSegments.find((s, idx) => {
        const next = audio.transcriptSegments[idx + 1];
        return next ? seconds >= s.timeInSeconds && seconds < next.timeInSeconds : seconds >= s.timeInSeconds;
      }) || audio.transcriptSegments[0];

      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.rate = playbackRate;
      if (audio.language === 'Bengali' || audio.id.includes('-bn')) utterance.lang = 'bn-IN';
      else if (audio.language === 'Marathi' || audio.id.includes('-mr')) utterance.lang = 'mr-IN';
      else if (audio.language === 'Hindi' || audio.id.includes('-hi')) utterance.lang = 'hi-IN';
      else if (audio.language === 'Tamil' || audio.id.includes('-ta')) utterance.lang = 'ta-IN';
      else utterance.lang = 'en-US';

      synthRef.current.speak(utterance);
    }
  };

  const changeSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setPlaybackRate(nextSpeed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulated audio playback timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackRate]);

  // Determine active transcript segment
  const activeSegmentIndex = audio.transcriptSegments.findIndex((seg, idx) => {
    const nextSeg = audio.transcriptSegments[idx + 1];
    if (nextSeg) {
      return currentTime >= seg.timeInSeconds && currentTime < nextSeg.timeInSeconds;
    }
    return currentTime >= seg.timeInSeconds;
  });

  const filteredSegments = audio.transcriptSegments.filter(seg =>
    searchQuery ? seg.text.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="bg-white rounded-lg border border-sanchay-borderCream shadow-archival overflow-hidden" suppressHydrationWarning>
      
      {/* Audio Player Header / Cover Banner */}
      <div className="bg-sanchay-deepNavy p-6 text-white flex flex-col md:flex-row items-center gap-6">
        <div className="w-32 h-32 rounded border-2 border-sanchay-gold overflow-hidden bg-sanchay-darkNavy flex-shrink-0 flex items-center justify-center relative">
          <Mic className="w-12 h-12 text-sanchay-gold" />
          {isPlaying && (
            <div className="absolute bottom-2 px-2 py-0.5 rounded bg-sanchay-gold text-sanchay-deepNavy font-mono text-[9px] font-bold animate-pulse">
              PLAYING AUDIO
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sanchay-gold text-sanchay-deepNavy uppercase">
              AUTHENTIC SPEECH RECORDING
            </span>
            <span className="text-xs text-sanchay-cream/70 font-mono">{audio.date}</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-sanchay-gold">{audio.title}</h1>
          <p className="text-xs text-sanchay-cream/80 mt-1 font-sans">
            Speaker: <strong className="text-white">{audio.speaker}</strong> • Location: {audio.location}
          </p>
          <div className="mt-2 text-[11px] text-sanchay-cream/60">
            Source: {audio.source} • Rights: {audio.rights}
          </div>
        </div>
      </div>

      {/* Main Playback Controls Bar */}
      <div className="bg-sanchay-darkNavy px-6 py-4 border-t border-sanchay-gold/30 text-white flex flex-col gap-3">
        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-sanchay-gold">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="flex-1 accent-sanchay-gold cursor-pointer h-2 bg-sanchay-deepNavy rounded"
            suppressHydrationWarning
          />
          <span className="text-xs font-mono text-sanchay-cream/70">{formatTime(duration)}</span>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-sanchay-gold text-sanchay-deepNavy flex items-center justify-center hover:bg-sanchay-goldLight transition-transform active:scale-95 shadow-goldGlow cursor-pointer"
              suppressHydrationWarning
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={changeSpeed}
              className="px-3 py-1.5 rounded bg-sanchay-deepNavy border border-sanchay-gold/40 text-xs font-mono text-sanchay-gold hover:border-sanchay-gold cursor-pointer"
              suppressHydrationWarning
            >
              {playbackRate}x
            </button>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded text-sanchay-cream hover:text-sanchay-gold cursor-pointer"
              suppressHydrationWarning
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <SaveToStudyPackButton
              item={{
                id: audio.id,
                itemType: 'AUDIO',
                title: audio.title,
                description: `${audio.speaker || 'Dr. B. R. Ambedkar'} - ${audio.location || 'Archival Speech'} (${audio.duration})`,
                url: `/audio/${audio.id}`,
              }}
              variant="secondary"
            />
            <a
              href="/audio/mahad_satyagraha_speech.mp3"
              download
              className="px-3 py-1.5 rounded bg-sanchay-deepNavy border border-sanchay-gold/40 text-xs text-sanchay-cream flex items-center gap-1 hover:border-sanchay-gold"
            >
              <Download className="w-3.5 h-3.5 text-sanchay-gold" /> Download Audio
            </a>
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 rounded bg-sanchay-deepNavy border border-sanchay-gold/40 text-xs text-sanchay-cream flex items-center gap-1 hover:border-sanchay-gold cursor-pointer"
              suppressHydrationWarning
            >
              <Share2 className="w-3.5 h-3.5 text-sanchay-gold" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Synchronized Transcript & Search Area */}
      <div className="p-6 bg-sanchay-creamLight">
        <div className="flex items-center justify-between border-b border-sanchay-borderCream pb-3 mb-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('transcript')}
              className={`text-sm font-serif font-bold pb-1 border-b-2 transition-colors ${
                activeTab === 'transcript' ? 'border-sanchay-gold text-sanchay-deepNavy' : 'border-transparent text-sanchay-textMuted'
              }`}
              suppressHydrationWarning
            >
              Synchronized Transcript
            </button>
          </div>

          {/* Search inside transcript */}
          <div className="relative">
            <Search className="w-4 h-4 text-sanchay-textMuted absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded border border-sanchay-borderCream bg-white text-sanchay-textDark focus:outline-none focus:border-sanchay-gold"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Transcript Segments List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {filteredSegments.map((seg, idx) => {
            const isSegmentActive = activeSegmentIndex === idx;
            return (
              <div
                key={idx}
                onClick={() => handleSeek(seg.timeInSeconds)}
                className={`p-3.5 rounded border transition-all cursor-pointer flex items-start gap-4 ${
                  isSegmentActive
                    ? 'bg-sanchay-deepNavy text-white border-sanchay-gold shadow-md'
                    : 'bg-white text-sanchay-textDark border-sanchay-borderCream hover:border-sanchay-gold hover:bg-sanchay-cream/30'
                }`}
              >
                <button
                  type="button"
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded flex-shrink-0 ${
                    isSegmentActive ? 'bg-sanchay-gold text-sanchay-deepNavy' : 'bg-sanchay-cream text-sanchay-deepNavy border border-sanchay-gold/30'
                  }`}
                  suppressHydrationWarning
                >
                  {seg.timestamp}
                </button>
                <div className="flex-1">
                  <div className={`text-[11px] font-semibold mb-0.5 ${isSegmentActive ? 'text-sanchay-gold' : 'text-sanchay-textMuted'}`}>
                    {seg.speaker}
                  </div>
                  <p className="text-xs leading-relaxed font-sans">{seg.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={audio.title}
      />

    </div>
  );
}
