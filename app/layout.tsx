import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/translations/LanguageContext';

export const metadata: Metadata = {
  title: 'SANCHAY — Digital Heritage Archive of Dr. B. R. Ambedkar',
  description: 'AI-Powered Digital Heritage Archive, Research Library and Audio-Visual Knowledge Platform dedicated exclusively to Dr. B. R. Ambedkar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="bg-sanchay-cream min-h-screen flex flex-col font-sans text-sanchay-textDark antialiased" suppressHydrationWarning={true}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
