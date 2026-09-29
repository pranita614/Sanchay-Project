import { SEED_DOCUMENTS, SEED_AUDIO, SEED_VIDEO, SEED_TIMELINE, SEED_QUOTES, SEED_VOWS, SEED_MINDMAP } from './seed-data';

// Safe Database Layer that provides instant fallback to authentic seeded archival data if Prisma/PostgreSQL is connecting or offline.

export const dbStore = {
  documents: [...SEED_DOCUMENTS],
  audios: [...SEED_AUDIO],
  videos: [...SEED_VIDEO],
  timeline: [...SEED_TIMELINE],
  quotes: [...SEED_QUOTES],
  vows: [...SEED_VOWS],
  mindmap: [...SEED_MINDMAP],
  bookmarks: [] as any[],
  auditLogs: [
    { id: "log-1", userId: "admin-1", action: "LOGIN", resource: "System", details: "Staff admin logged in successfully", createdAt: new Date().toISOString() },
    { id: "log-2", userId: "admin-1", action: "PUBLISH", resource: "Document", resourceId: "doc-annihilation-caste", details: "Verified BAWS Vol 1 record published", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "log-3", userId: "curator-1", action: "INDEX", resource: "AI Knowledge Base", details: "Indexed 103 chunks of Annihilation of Caste", createdAt: new Date(Date.now() - 7200000).toISOString() }
  ],
  studyPacks: [] as any[],
  analytics: [
    { metric: "DOC_VIEW", targetId: "doc-annihilation-caste", count: 14520 },
    { metric: "AUDIO_PLAY", targetId: "audio-mahad-satyagraha", count: 8420 },
    { metric: "VIDEO_PLAY", targetId: "video-constituent-assembly-address", count: 12100 },
    { metric: "AI_QUERY", targetId: "ask-sanchay", count: 5230 },
  ]
};

export default dbStore;
