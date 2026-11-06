'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Character, Message } from '@/types';
import { saveChat, loadChat } from '@/lib/storage';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';

interface ChatWindowProps {
  character: Character;
}

export default function ChatWindow({ character }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const history = loadChat(character.id);
    if (history) {
      setMessages(history.messages);
    }
  }, [character.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      saveChat({
        characterId: character.id,
        messages,
        lastUpdated: Date.now(),
      });
    }
  }, [messages, character.id]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId: character.id,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamingText(fullText);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Простите, не могу ответить сейчас. Попробуйте позже.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, character.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(`litai_chat_${character.id}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
              <span className="font-playfair text-2xl text-gold font-bold">
                {character.name[0]}
              </span>
            </div>
            <h3 className="font-playfair text-xl text-gold mb-2">{character.name}</h3>
            <p className="text-cream/60 text-sm max-w-sm italic">«{character.tagline}»</p>
            <p className="text-cream/40 text-xs mt-4">
              Задайте вопрос или выберите один из предложенных ниже
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            characterName={msg.role === 'assistant' ? character.name : undefined}
          />
        ))}

        {/* Streaming message */}
        {streamingText && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingText,
              timestamp: Date.now(),
            }}
            characterName={character.name}
          />
        )}

        {/* Loading indicator */}
        {isLoading && !streamingText && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-xs font-playfair">{character.name[0]}</span>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gold/50 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <SuggestedQuestions
          questions={character.suggestedQuestions}
          onSelect={sendMessage}
          disabled={isLoading}
        />
      )}

      {/* Input area */}
      <div className="border-t border-cream/10 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Спросите у ${character.name.split(' ')[0]}...`}
            disabled={isLoading}
            rows={1}
            className="flex-1 resize-none bg-dark-bg border border-cream/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50 max-h-32 overflow-y-auto"
            style={{ minHeight: '48px' }}
          />
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 rounded-xl bg-gold/80 hover:bg-gold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-dark-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="mt-2 text-xs text-cream/30 hover:text-cream/60 transition-colors"
          >
            Очистить историю
          </button>
        )}
      </div>
    </div>
  );
}
