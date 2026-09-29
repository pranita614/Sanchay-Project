import { ArchivalDocument } from '@/lib/db/seed-data';

/**
 * Resolves the official BAWS (Dr. Babasaheb Ambedkar Writings and Speeches)
 * website URL for a full book/document in the user's selected language.
 *
 * Support for:
 * - English (EN) -> e.g. https://baws.in/books/baws/EN/Volume_01/pdf/38
 * - Marathi (MR) -> e.g. https://baws.in/books/baws/MR/Khand_01/pdf/1
 * - Hindi (HI)   -> e.g. https://baws.in/books/baws/HI/Volume_1/pdf/18
 * - Bengali (BN) -> e.g. https://baws.in/books/baws/EN/Volume_01/pdf/38
 * - Tamil (TA)   -> e.g. https://baws.in/books/baws/EN/Volume_01/pdf/38
 */
export interface BawsDocItem {
  id?: string;
  pdfUrl?: string;
  marathiPdfUrl?: string;
  hindiPdfUrl?: string;
  bengaliPdfUrl?: string;
  tamilPdfUrl?: string;
  sourceUrl?: string;
  volume?: string;
  type?: string;
}

export function getBawsBookUrl(doc: BawsDocItem, language: string): string {
  const docId = doc.id || '';

  if (language === 'Marathi') {
    if (doc.marathiPdfUrl) return doc.marathiPdfUrl;

    const marathiBawsMap: Record<string, string> = {
      'doc-annihilation-caste': 'https://baws.in/books/baws/MR/Khand_01/pdf/1',
      'doc-castes-in-india': 'https://baws.in/books/baws/MR/Khand_01/pdf/20',
      'doc-maharashtra-as-a-linguistic-province': 'https://baws.in/books/baws/MR/Khand_01/pdf/144',
      'doc-need-for-checks-and-balances': 'https://baws.in/books/baws/MR/Khand_01/pdf/114',
      'doc-thoughts-on-linguistic-states': 'https://baws.in/books/baws/MR/Khand_01/pdf/144',
      'doc-problem-of-rupee': 'https://baws.in/books/baws/MR/Khand_06/pdf/1',
      'doc-who-were-shudras': 'https://baws.in/books/baws/MR/Khand_07/pdf/1',
      'doc-states-and-minorities': 'https://baws.in/books/baws/MR/Khand_01/pdf/144',
      'doc-buddha-and-his-dhamma': 'https://baws.in/books/baws/MR/Khand_11/pdf/1',
      'doc-constituent-assembly-debates': 'https://baws.in/books/baws/MR/Khand_13/pdf/1',
      'doc-notes-on-parliamentary-procedure': 'https://baws.in/books/baws/MR/Khand_12/pdf/725',
      'doc-reply-to-the-mahatma': 'https://baws.in/books/baws/MR/Khand_01/pdf/101',
      'doc-letter-forwarding': 'https://baws.in/books/baws/MR/Khand_17_01/pdf/1',
      'doc-letter-resignation': 'https://baws.in/books/baws/MR/Khand_14/pdf/1',
      'doc-letter-cabinet-mission-protest': 'https://baws.in/books/baws/MR/Khand_17_02/pdf/1',
      'doc-marathi-khand-18-1': 'https://baws.in/books/baws/MR/Khand_18_1/pdf/43',
      'doc-marathi-khand-18-2': 'https://baws.in/books/baws/MR/Khand_18_2/pdf/39',
      'doc-marathi-khand-18-3': 'https://baws.in/books/baws/MR/Khand_18_3/pdf/39',
      'doc-marathi-khand-19': 'https://baws.in/books/baws/MR/Khand_19/pdf/45',
      'doc-marathi-khand-20': 'https://baws.in/books/baws/MR/Khand_20/pdf/43'
    };

    return marathiBawsMap[docId] || doc.pdfUrl || 'https://baws.in/books/baws/MR/Khand_01/pdf/1';
  }

  if (language === 'Hindi') {
    if (doc.hindiPdfUrl) return doc.hindiPdfUrl;

    const hindiBawsMap: Record<string, string> = {
      'doc-annihilation-caste': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-castes-in-india': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-maharashtra-as-a-linguistic-province': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-need-for-checks-and-balances': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-thoughts-on-linguistic-states': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-problem-of-rupee': 'https://baws.in/books/baws/HI/Volume_6/pdf/1',
      'doc-who-were-shudras': 'https://baws.in/books/baws/HI/Volume_7/pdf/1',
      'doc-states-and-minorities': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-buddha-and-his-dhamma': 'https://baws.in/books/baws/HI/Volume_11/pdf/1',
      'doc-constituent-assembly-debates': 'https://baws.in/books/baws/HI/Volume_13/pdf/1',
      'doc-notes-on-parliamentary-procedure': 'https://baws.in/books/baws/HI/Volume_12/pdf/18',
      'doc-reply-to-the-mahatma': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-letter-forwarding': 'https://baws.in/books/baws/HI/Volume_17_01/pdf/1',
      'doc-letter-resignation': 'https://baws.in/books/baws/HI/Volume_14/pdf/1',
      'doc-letter-cabinet-mission-protest': 'https://baws.in/books/baws/HI/Volume_17_02/pdf/1',
      'doc-hindi-vol-1': 'https://baws.in/books/baws/HI/Volume_1/pdf/18',
      'doc-hindi-vol-2': 'https://baws.in/books/baws/HI/Volume_2/pdf/18',
      'doc-hindi-vol-3': 'https://baws.in/books/baws/HI/Volume_3/pdf/18'
    };

    return hindiBawsMap[docId] || doc.pdfUrl || 'https://baws.in/books/baws/HI/Volume_1/pdf/18';
  }

  if (language === 'Bengali') {
    if (doc.bengaliPdfUrl) return doc.bengaliPdfUrl;
    return doc.pdfUrl || 'https://baws.in/books/baws/EN/Volume_01/pdf/38';
  }

  if (language === 'Tamil') {
    if (doc.tamilPdfUrl) return doc.tamilPdfUrl;
    return doc.pdfUrl || 'https://baws.in/books/baws/EN/Volume_01/pdf/38';
  }

  // Default English (EN)
  return doc.pdfUrl || doc.sourceUrl || 'https://baws.in/books/baws/EN/Volume_01/pdf/38';
}

/**
 * Returns a human-friendly BAWS volume label for the selected language
 */
export function getBawsVolumeLabel(doc: BawsDocItem, language: string): string {
  if (language === 'Marathi') {
    return doc.volume ? doc.volume.replace('Vol.', 'खंड').replace('Volume', 'खंड') : 'मराठी खंड';
  }
  if (language === 'Hindi') {
    return doc.volume ? doc.volume.replace('Vol.', 'भाग').replace('Volume', 'भाग') : 'हिंदी भाग';
  }
  return doc.volume || 'Volume Archive';
}
