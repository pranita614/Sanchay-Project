'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink, RotateCcw, AlertTriangle, Building, Tag, ShieldCheck, Film } from 'lucide-react';
import { ArchivalVideo } from '@/lib/db/seed-data';
import SaveToStudyPackButton from '@/components/study-pack/SaveToStudyPackButton';

export function getYouTubeEmbedUrl(url?: string): string {
  if (!url || !url.trim()) {
    return 'https://www.youtube.com/embed/Nn1l0z5x-fE?autoplay=1&controls=1&rel=0';
  }

  const cleanUrl = url.trim();
  let videoId = '';

  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) videoId = shortMatch[1];

  if (!videoId) {
    const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch && watchMatch[1]) videoId = watchMatch[1];
  }

  if (!videoId) {
    const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch && embedMatch[1]) videoId = embedMatch[1];
  }

  if (!videoId && !cleanUrl.includes('/') && cleanUrl.length >= 8) {
    videoId = cleanUrl;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;
  }

  if (cleanUrl.includes('youtube.com/embed')) {
    return cleanUrl.includes('autoplay=1') ? cleanUrl : `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}autoplay=1&controls=1&rel=0`;
  }

  return cleanUrl;
}

export default function VideoPlayer({ video }: { video: ArchivalVideo }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isMp4Video = video.videoUrl.endsWith('.mp4') || video.videoUrl.includes('archive.org/download/');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds || 0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlay = () => {
    if (isMp4Video && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setHasError(true));
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(volume || 1);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = volume || 1;
      }
    } else {
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.().catch(() => {});
      }
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = Math.floor(secs % 60);

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const isInternetArchive = video.source.toLowerCase().includes('internet archive') || (video.archiveId && video.archiveId.startsWith('dli.'));

  return (
    <div className="space-y-8 font-sans" suppressHydrationWarning>
      
      {/* 1. MAIN 16:9 VIDEO PLAYER CONTAINER */}
      <div
        ref={containerRef}
        className="bg-black rounded-xl border-2 border-[#062A4A] shadow-2xl overflow-hidden relative group"
      >
        <div className="aspect-video w-full relative bg-black flex items-center justify-center overflow-hidden">
          
          {hasError ? (
            /* ERROR STATE */
            <div className="p-8 text-center space-y-4 max-w-md bg-[#082F52]/90 rounded-xl border border-[#C9A227]/40 shadow-xl">
              <AlertTriangle className="w-12 h-12 text-[#C9A227] mx-auto animate-bounce" />
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-white">Unable to load this archival video</h3>
                <p className="text-xs text-sanchay-cream/80 font-sans">
                  The media stream could not be loaded directly. You can retry or open the verified source page.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="px-4 py-2 rounded bg-[#062A4A] text-[#C9A227] border border-[#C9A227] font-bold text-xs flex items-center gap-1.5 hover:bg-[#082F52] cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                <a
                  href={video.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-[#C9A227] text-[#062A4A] font-bold text-xs flex items-center gap-1.5 hover:bg-yellow-400 shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" /> Open Original Source ↗
                </a>
              </div>
            </div>
          ) : isMp4Video ? (
            /* HTML5 NATIVE VIDEO PLAYER FOR MP4 FILES */
            <video
              ref={videoRef}
              controls={false}
              preload="metadata"
              poster={video.thumbnailUrl || '/images/ambedkar_portrait.jpg'}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                  if (videoRef.current.duration) setDuration(videoRef.current.duration);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current?.duration) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onError={() => setHasError(true)}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            /* EMBEDDED IFRAME PLAYER FOR YOUTUBE / EXTERNAL SOURCES */
            isPlaying ? (
              <iframe
                className="w-full h-full border-0"
                src={getYouTubeEmbedUrl(video.videoUrl)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              /* POSTER & CENTRAL PLAY BUTTON */
              <div className="relative w-full h-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${video.thumbnailUrl || '/images/ambedkar_portrait.jpg'})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
                
                {/* Central Play Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="relative z-20 w-20 h-20 rounded-full bg-[#C9A227] text-[#062A4A] flex items-center justify-center shadow-goldGlow hover:scale-110 transition-transform cursor-pointer"
                  title="Play Video"
                >
                  <Play className="w-10 h-10 fill-current ml-1" />
                </button>

                {/* Top Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded bg-[#062A4A] text-[#C9A227] text-xs font-mono font-bold border border-[#C9A227]/40 uppercase tracking-wider">
                    {isInternetArchive ? 'INTERNET ARCHIVE' : 'GOVERNMENT OF INDIA'}
                  </span>
                </div>
              </div>
            )
          )}

          {/* HTML5 VIDEO OVERLAY CONTROLS BAR (FOR MP4 VIDEO) */}
          {isMp4Video && !hasError && (
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 space-y-2 text-white">
              
              {/* Progress Slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#C9A227]">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="flex-1 accent-[#C9A227] h-1.5 cursor-pointer bg-slate-700 rounded"
                />
                <span className="text-xs font-mono text-slate-300">{formatTime(duration)}</span>
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between pt-1">
                
                {/* Left Controls: Play/Pause, Volume */}
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="text-[#C9A227] hover:text-white transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                  </button>

                  {/* Volume Slider & Mute */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="text-slate-300 hover:text-[#C9A227] cursor-pointer"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-16 accent-[#C9A227] h-1 cursor-pointer bg-slate-700 rounded hidden sm:inline-block"
                    />
                  </div>
                </div>

                {/* Right Controls: Playback Speed & Fullscreen */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400 hidden sm:inline">Speed:</span>
                  <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded border border-white/20">
                    {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleRateChange(rate)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          playbackRate === rate ? 'bg-[#C9A227] text-[#062A4A]' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="text-slate-300 hover:text-[#C9A227] cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>

      {/* 2. VIDEO METADATA & PRIMARY DETAILS PANEL */}
      <div className="bg-white rounded-xl border border-sanchay-borderCream p-6 sm:p-8 shadow-archival space-y-6">
        
        <div className="space-y-3 border-b border-sanchay-borderCream pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded bg-[#062A4A] text-[#C9A227] text-xs font-mono font-bold flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-[#C9A227]" /> {video.type || 'Archival Video'}
            </span>
            {video.year && (
              <span className="px-3 py-1 rounded bg-sanchay-cream text-[#062A4A] text-xs font-mono font-bold border border-sanchay-gold/30">
                {video.year}
              </span>
            )}
            <span className={`px-3 py-1 rounded text-xs font-mono font-bold ${
              isInternetArchive ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}>
              {isInternetArchive ? 'INTERNET ARCHIVE' : 'GOVERNMENT OF INDIA'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#062A4A] leading-tight">
              {video.title}
            </h1>
            <SaveToStudyPackButton
              item={{
                id: video.id,
                itemType: 'VIDEO',
                title: video.title,
                description: video.description || `${video.creator || 'Archival Video'} (${video.year || ''})`,
                url: `/video/${video.id}`,
              }}
              variant="secondary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs font-sans">
            {video.creator && (
              <div>
                <span className="text-sanchay-textMuted block text-[10px] font-mono uppercase">Creator / Producer</span>
                <strong className="text-[#062A4A] font-serif text-sm">{video.creator}</strong>
              </div>
            )}
            {video.director && (
              <div>
                <span className="text-sanchay-textMuted block text-[10px] font-mono uppercase">Director</span>
                <strong className="text-[#062A4A] font-serif text-sm">{video.director}</strong>
              </div>
            )}
            <div>
              <span className="text-sanchay-textMuted block text-[10px] font-mono uppercase">Source</span>
              <strong className="text-[#062A4A] font-serif text-sm">{video.source}</strong>
            </div>
            {video.archiveId && (
              <div>
                <span className="text-sanchay-textMuted block text-[10px] font-mono uppercase">Archive Identifier</span>
                <strong className="text-[#062A4A] font-mono text-sm">{video.archiveId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* ABOUT THIS FILM SECTION */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#062A4A] flex items-center gap-2">
            About this film
          </h2>
          <p className="text-sm text-sanchay-textDark leading-relaxed font-sans bg-sanchay-creamLight p-5 rounded-xl border border-sanchay-borderCream whitespace-pre-line">
            {video.description}
          </p>
        </div>

        {/* PROVENANCE CARD SECTION */}
        <div className="bg-[#062A4A] text-white rounded-xl border border-[#C9A227]/40 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#C9A227]/30 pb-3">
            <h3 className="text-sm font-mono font-bold text-[#C9A227] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" /> Archival Provenance & Source Metadata
            </h3>
            <span className="text-[10px] font-mono bg-[#C9A227]/20 text-[#C9A227] px-2 py-0.5 rounded border border-[#C9A227]/40 font-bold">
              VERIFIED RECORD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#C9A227]/70 text-[10px] block uppercase">Source</span>
              <strong className="text-white font-bold">{video.source}</strong>
            </div>
            <div>
              <span className="text-[#C9A227]/70 text-[10px] block uppercase">Identifier</span>
              <strong className="text-white font-bold">{video.archiveId || 'DAF-GOI-RECORD'}</strong>
            </div>
            <div>
              <span className="text-[#C9A227]/70 text-[10px] block uppercase">Original Institution</span>
              <strong className="text-white font-bold">{video.creator || video.source}</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href={video.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#C9A227] text-[#062A4A] font-bold text-xs flex items-center gap-2 hover:bg-yellow-400 shadow-md transition-all cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#062A4A]" /> View Original Source ↗
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
