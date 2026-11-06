'use client';

import Link from 'next/link';
import { BookRecommendation } from '@/types';

interface BookCardProps {
  recommendation: BookRecommendation;
  rank: number;
}

const difficultyLabel: Record<string, string> = {
  easy: 'Лёгкое',
  medium: 'Среднее',
  hard: 'Сложное',
};

const difficultyColor: Record<string, string> = {
  easy: 'text-green-400 border-green-400/30 bg-green-400/10',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  hard: 'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function BookCard({ recommendation, rank }: BookCardProps) {
  const { book, explanation } = recommendation;

  return (
    <div className="rounded-lg border border-gold/20 bg-dark-card p-5 hover:border-gold/40 transition-all">
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
          <span className="font-playfair text-gold font-bold text-lg">{rank}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-playfair text-lg font-bold text-gold leading-tight">
              «{book.title}»
            </h3>
            <span
              className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${
                difficultyColor[book.difficulty]
              }`}
            >
              {difficultyLabel[book.difficulty]}
            </span>
          </div>

          <p className="text-sm text-cream/60 mb-3">
            {book.author} · {book.year}
          </p>

          {/* AI explanation */}
          <p className="text-sm text-cream/90 leading-relaxed mb-3 italic border-l-2 border-gold/30 pl-3">
            {explanation || book.description}
          </p>

          {/* Themes */}
          <div className="flex flex-wrap gap-1 mb-4">
            {book.themes.slice(0, 4).map((theme) => (
              <span
                key={theme}
                className="text-xs px-2 py-0.5 rounded-full border border-gold/15 text-gold/60 bg-gold/5"
              >
                {theme}
              </span>
            ))}
          </div>

          {/* Talk to character button */}
          {book.characterId && (
            <Link
              href={`/chat/${book.characterId}`}
              className="inline-flex items-center gap-2 text-sm text-gold border border-gold/30 px-4 py-2 rounded-full hover:bg-gold/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Поговорить с героем
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
