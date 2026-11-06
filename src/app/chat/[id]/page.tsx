import { notFound } from 'next/navigation';
import { characters } from '@/data/characters';
import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }));
}

export function generateMetadata({ params }: PageProps) {
  const character = characters.find((c) => c.id === params.id);
  if (!character) return {};
  return {
    title: `${character.name} · LitAI`,
    description: `Поговорите с ${character.name} из «${character.work}». ${character.tagline}`,
  };
}

export default function ChatPage({ params }: PageProps) {
  const character = characters.find((c) => c.id === params.id);
  if (!character) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Character header */}
      <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border border-gold/20 bg-dark-card">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gold/10 border-2 border-gold/40 flex items-center justify-center flex-shrink-0">
          <span className="font-playfair text-2xl font-bold text-gold">
            {character.name[0]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-playfair text-xl font-bold text-gold truncate">
            {character.name}
          </h1>
          <p className="text-cream/60 text-sm">
            «{character.work}» · {character.author} · {character.year}
          </p>
          <p className="text-cream/40 text-xs mt-1 italic truncate">
            «{character.tagline}»
          </p>
        </div>

        <Link
          href="/"
          className="flex-shrink-0 text-xs text-cream/40 hover:text-gold transition-colors border border-cream/10 hover:border-gold/30 px-3 py-1.5 rounded-full"
        >
          ← Герои
        </Link>
      </div>

      {/* Chat window */}
      <div
        className="rounded-xl border border-cream/10 bg-dark-card overflow-hidden"
        style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}
      >
        <ChatWindow character={character} />
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-cream/25 text-center mt-4">
        Ответы генерируются ИИ и могут содержать неточности. Это учебный проект.
      </p>
    </div>
  );
}
