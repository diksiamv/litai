import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  style: ['normal', 'italic'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'LitAI — Беседы с героями русской литературы',
  description: 'Поговорите с Онегиным, Раскольниковым, Наташей Ростовой и другими героями русской литературы XIX века. ИИ-чат + персональные рекомендации книг.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-dark-bg text-cream min-h-screen font-inter">
        {/* Header */}
        <header className="border-b border-gold/20 backdrop-blur-sm bg-dark-bg/80 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-playfair text-2xl font-bold text-gold group-hover:text-gold/80 transition-colors">
                LitAI
              </span>
              <span className="text-cream/40 text-sm hidden sm:block">· Русская литература</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-cream/70 hover:text-gold transition-colors"
              >
                Герои
              </Link>
              <Link
                href="/recommend"
                className="text-sm text-cream/70 hover:text-gold transition-colors"
              >
                Рекомендации
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gold/10 mt-24 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-cream/30 text-sm">
            <p>LitAI · Русская литература XIX века · Учебный проект</p>
            <p className="mt-1">Ответы генерируются ИИ и могут содержать неточности</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
