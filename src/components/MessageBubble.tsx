'use client';

import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  characterName?: string;
}

export default function MessageBubble({ message, characterName }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mr-3 mt-1">
          <span className="text-gold text-xs font-playfair font-bold">
            {characterName?.[0] ?? '?'}
          </span>
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && characterName && (
          <span className="text-xs text-gold/60 mb-1 ml-1 font-playfair">{characterName}</span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gold/20 border border-gold/30 text-cream rounded-tr-sm'
              : 'bg-parchment/10 border border-cream/10 text-cream/90 rounded-tl-sm'
          }`}
          style={{
            backgroundImage: !isUser
              ? 'linear-gradient(135deg, rgba(255,248,220,0.05) 0%, rgba(255,248,220,0.02) 100%)'
              : undefined,
          }}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-cream/30 mt-1 mx-1">
          {new Date(message.timestamp).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-card border border-cream/20 flex items-center justify-center ml-3 mt-1">
          <svg className="w-4 h-4 text-cream/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
