'use client';

import { useState } from 'react';
import InterestPicker from '@/components/InterestPicker';
import BookCard from '@/components/BookCard';
import { UserInterests, BookRecommendation } from '@/types';
import { characters } from '@/data/characters';
import { saveInterests, loadInterests } from '@/lib/storage';

const GENRE_OPTIONS = [
  { value: 'психологический роман', label: 'Психологический роман' },
  { value: 'реализм', label: 'Реализм' },
  { value: 'эпический роман', label: 'Эпическая проза' },
  { value: 'роман в стихах', label: 'Поэзия' },
  { value: 'сатира', label: 'Сатира' },
  { value: 'драма', label: 'Драма' },
  { value: 'исторический роман', label: 'Исторический роман' },
];

const THEME_OPTIONS = [
  { value: 'любовь', label: 'Любовь' },
  { value: 'вина', label: 'Вина и искупление' },
  { value: 'война', label: 'Война' },
  { value: 'общество', label: 'Общество' },
  { value: 'судьба', label: 'Судьба' },
  { value: 'мораль', label: 'Мораль' },
  { value: 'семья', label: 'Семья' },
  { value: 'нигилизм', label: 'Нигилизм' },
  { value: 'бедность', label: 'Социальная несправедливость' },
  { value: 'смерть', label: 'Смерть и смысл жизни' },
];

const MOOD_OPTIONS = [
  { value: 'трагическое', label: '😢 Трагическое' },
  { value: 'романтическое', label: '💕 Романтическое' },
  { value: 'философское', label: '🤔 Философское' },
  { value: 'ироничное', label: '😏 Ироничное' },
  { value: 'напряжённое', label: '😰 Напряжённое' },
  { value: 'духовное', label: '✨ Духовное' },
];

const CHARACTER_OPTIONS = characters.map((c) => ({
  value: c.id,
  label: `${c.name.split(' ')[0]} (${c.work})`,
}));

const DEFAULT_INTERESTS: UserInterests = {
  genres: [],
  themes: [],
  favoriteCharacters: [],
  mood: [],
};

export default function RecommendPage() {
  const [interests, setInterests] = useState<UserInterests>(() => {
    if (typeof window !== 'undefined') {
      return loadInterests() ?? DEFAULT_INTERESTS;
    }
    return DEFAULT_INTERESTS;
  });
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResults, setHasResults] = useState(false);

  const updateInterests = (key: keyof UserInterests) => (values: string[]) => {
    setInterests((prev) => {
      const updated = { ...prev, [key]: values };
      saveInterests(updated);
      return updated;
    });
  };

  const getRecommendations = async () => {
    const hasAnyInterest =
      interests.genres.length > 0 ||
      interests.themes.length > 0 ||
      interests.favoriteCharacters.length > 0 ||
      interests.mood.length > 0;

    if (!hasAnyInterest) {
      setError('Выберите хотя бы один интерес для подбора книг');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interests),
      });

      if (!res.ok) throw new Error('Ошибка сервера');

      const data = await res.json() as BookRecommendation[];
      setRecommendations(data);
      setHasResults(true);
    } catch (err) {
      console.error(err);
      setError('Не удалось получить рекомендации. Проверьте API ключ и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setHasResults(false);
    setRecommendations([]);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <p className="text-gold/70 text-sm uppercase tracking-widest mb-3">Персональный подбор</p>
        <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-cream mb-4">
          Какую книгу <span className="text-gold italic">прочитать?</span>
        </h1>
        <p className="text-cream/60 max-w-xl mx-auto leading-relaxed">
          Выберите жанры, темы и настроение — ИИ подберёт книги и объяснит, почему они вам подойдут.
        </p>
      </div>

      {!hasResults ? (
        <div className="space-y-2">
          <div className="rounded-xl border border-cream/10 bg-dark-card p-6">
            <InterestPicker
              title="📖 Любимые жанры"
              options={GENRE_OPTIONS}
              selected={interests.genres}
              onChange={updateInterests('genres')}
            />
            <InterestPicker
              title="💡 Интересные темы"
              options={THEME_OPTIONS}
              selected={interests.themes}
              onChange={updateInterests('themes')}
            />
            <InterestPicker
              title="🎭 Настроение"
              options={MOOD_OPTIONS}
              selected={interests.mood}
              onChange={updateInterests('mood')}
              maxSelect={3}
            />
            <InterestPicker
              title="🎭 С кем вы общались?"
              options={CHARACTER_OPTIONS}
              selected={interests.favoriteCharacters}
              onChange={updateInterests('favoriteCharacters')}
            />
          </div>

          {error && (
            <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={getRecommendations}
            disabled={isLoading}
            className="w-full py-4 bg-gold text-dark-bg font-semibold rounded-xl hover:bg-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin" />
                Подбираем книги...
              </>
            ) : (
              <>
                <span>✨</span>
                Подобрать книги
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl text-gold">Ваши рекомендации</h2>
            <button
              onClick={reset}
              className="text-sm text-cream/50 hover:text-gold transition-colors border border-cream/10 hover:border-gold/30 px-4 py-2 rounded-full"
            >
              ← Изменить
            </button>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <BookCard key={rec.book.id} recommendation={rec} rank={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
