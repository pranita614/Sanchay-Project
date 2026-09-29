import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'study-packs.json');

function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH) || fs.statSync(FILE_PATH).size === 0) {
      fs.writeFileSync(FILE_PATH, JSON.stringify({}), 'utf-8');
    }
  } catch (err) {
    console.error('[StudyPack DiskStore] Failed to ensure directory/file:', err);
  }
}

function safeParseJson(content: string): Record<string, any> {
  if (!content || !content.trim()) return {};
  try {
    return JSON.parse(content);
  } catch (e) {
    return {};
  }
}

export function saveSharedStudyPackToDisk(token: string, payload: any): void {
  try {
    ensureFileExists();
    let data: Record<string, any> = {};
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, 'utf-8');
      data = safeParseJson(content);
    }
    data[token] = payload;
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[StudyPack DiskStore] Saved study pack ${token} to disk.`);
  } catch (err) {
    console.error('[StudyPack DiskStore] Failed to save to disk:', err);
  }
}

export function getSharedStudyPackFromDisk(token: string): any | null {
  try {
    ensureFileExists();
    if (!fs.existsSync(FILE_PATH)) return null;
    const content = fs.readFileSync(FILE_PATH, 'utf-8');
    const data = safeParseJson(content);
    return data[token] || null;
  } catch (err) {
    console.error('[StudyPack DiskStore] Failed to read from disk:', err);
    return null;
  }
}
