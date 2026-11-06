'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/chat/${character.id}`} className="group block h-full select-none">
      <div className="relative h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/25 bg-[#0d0d14] p-5 shadow-lg shadow-black/40 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/15">
        
        {/* Subtle decorative vintage corner accents */}
        <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-t border-l border-gold/40 rounded-tl-sm transition-colors duration-300 group-hover:border-gold/80" />
        <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-t border-r border-gold/40 rounded-tr-sm transition-colors duration-300 group-hover:border-gold/80" />
        <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold/40 rounded-bl-sm transition-colors duration-300 group-hover:border-gold/80" />
        <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold/40 rounded-br-sm transition-colors duration-300 group-hover:border-gold/80" />

        {/* BACKGROUND PORTRAIT WITH FEATHERED EDGES (РАСТУШЁВКА) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {!imageError ? (
            <div className="relative w-full h-full">
              <Image
                src={character.portrait}
                alt={character.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover object-top opacity-35 mix-blend-luminosity filter contrast-125 sepia-[0.35] transition-all duration-700 ease-out group-hover:opacity-65 group-hover:scale-105 group-hover:sepia-[0.15]"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            /* Fallback decorative monogram */
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
              <span className="font-playfair text-9xl text-gold font-bold">
                {character.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
          )}

          {/* Smooth vignetting & feathering mask to blur/fade all edges seamlessly into the card background */}
          {/* 1. Radial gradient feathering (focus in center-top, fading 100% to card bg at edges) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, transparent 20%, rgba(13, 13, 20, 0.45) 55%, #0d0d14 88%)',
            }}
          />

          {/* 2. Top-to-bottom dark gradient ensuring content remains super legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d14]/40 via-[#0d0d14]/75 to-[#0d0d14] to-95%" />

          {/* 3. Golden atmospheric glow on hover */}
          <div className="absolute inset-0 bg-gold/0 transition-colors duration-500 group-hover:bg-gold/[0.03]" />
        </div>

        {/* TOP CONTENT: Title, Work, Tagline */}
        <div className="relative z-10">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider text-gold/75 font-semibold">
              {character.year} г.
            </span>
            <span className="text-[10px] text-cream/45 tracking-wide">
              {character.author}
            </span>
          </div>

          <h3 className="font-playfair text-xl font-bold text-[#f8f1de] tracking-wide group-hover:text-gold transition-colors duration-300">
            {character.name}
          </h3>

          <p className="text-xs text-gold/80 font-medium mb-3">
            «{character.work}»
          </p>

          <div className="relative pl-3 border-l-2 border-gold/40 my-3">
            <p className="text-xs text-cream/85 italic leading-relaxed line-clamp-3">
              «{character.tagline}»
            </p>
          </div>
        </div>

        {/* BOTTOM CONTENT: Themes & CTA button */}
        <div className="relative z-10 pt-4 mt-auto">
          {/* Tag pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {character.themes.slice(0, 3).map((theme) => (
              <span
                key={theme}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-gold/25 text-[#eed8a1] bg-[#161622]/80 backdrop-blur-sm"
              >
                {theme}
              </span>
            ))}
          </div>

          {/* Call to action */}
          <div className="flex items-center justify-between pt-3 border-t border-cream/10 text-xs font-medium text-gold/85 transition-colors group-hover:text-gold">
            <span className="tracking-wide">Начать беседу</span>
            <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10 group-hover:translate-x-1">
              <svg
                className="w-3.5 h-3.5 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
