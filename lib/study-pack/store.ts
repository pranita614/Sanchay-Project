'use client';

export interface StudyPackItem {
  id: string;
  itemType: 'DOCUMENT' | 'AUDIO' | 'VIDEO' | 'PHOTOGRAPH' | 'TIMELINE' | 'QUOTE' | 'AI_ANSWER' | 'VOW' | 'OTHER';
  itemId?: string;
  title: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
  savedAt: string;
}

const STORAGE_KEY = 'sanchay_study_pack_items';
const EVENT_NAME = 'sanchay_study_pack_updated';

export function getStudyPackItems(): StudyPackItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read Study Pack items from localStorage:', e);
    return [];
  }
}

export function saveStudyPackItems(items: StudyPackItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error('Failed to save Study Pack items to localStorage:', e);
  }
}

export function isInStudyPack(id: string): boolean {
  const items = getStudyPackItems();
  return items.some((item) => item.id === id || item.itemId === id);
}

export function addToStudyPack(item: Omit<StudyPackItem, 'savedAt'>): { success: boolean; isDuplicate: boolean; item: StudyPackItem } {
  const items = getStudyPackItems();
  const existing = items.find((i) => i.id === item.id || (item.itemId && i.itemId === item.itemId));
  
  if (existing) {
    return { success: false, isDuplicate: true, item: existing };
  }

  const newItem: StudyPackItem = {
    ...item,
    savedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...items];
  saveStudyPackItems(updated);

  // Dispatch toast event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sanchay_study_pack_toast', {
      detail: {
        title: newItem.title,
        message: 'Added to My Study Pack',
        type: 'success',
      }
    }));
  }

  return { success: true, isDuplicate: false, item: newItem };
}

export function removeFromStudyPack(id: string): void {
  const items = getStudyPackItems();
  const updated = items.filter((i) => i.id !== id && i.itemId !== id);
  saveStudyPackItems(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sanchay_study_pack_toast', {
      detail: {
        title: 'Removed item',
        message: 'Removed from My Study Pack',
        type: 'info',
      }
    }));
  }
}

export function clearStudyPack(): void {
  saveStudyPackItems([]);
}

export function subscribeToStudyPack(callback: (items: StudyPackItem[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getStudyPackItems());
  };

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
