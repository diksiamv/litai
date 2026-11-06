import { Book, UserInterests, BookRecommendation } from '@/types';
import { books } from '@/data/books';

export function scoreBook(book: Book, interests: UserInterests): number {
  let score = 0;

  // Genre matching
  for (const genre of interests.genres) {
    if (book.genres.some((g) => g.toLowerCase().includes(genre.toLowerCase()))) {
      score += 3;
    }
  }

  // Theme matching
  for (const theme of interests.themes) {
    if (book.themes.some((t) => t.toLowerCase().includes(theme.toLowerCase()))) {
      score += 2;
    }
  }

  // Mood matching
  for (const mood of interests.mood) {
    if (book.mood.some((m) => m.toLowerCase().includes(mood.toLowerCase()))) {
      score += 1;
    }
  }

  // Bonus if user interacted with a character from a similar book
  for (const charId of interests.favoriteCharacters) {
    if (book.similarTo.includes(charId)) {
      score += 4;
    }
    if (book.characterId === charId) {
      score += 2;
    }
  }

  return score;
}

export function getTopBooks(interests: UserInterests, topN = 5): BookRecommendation[] {
  const scored = books
    .map((book) => ({
      book,
      score: scoreBook(book, interests),
      explanation: '', // will be filled by LLM
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // If not enough scored books, fill with random ones
  if (scored.length < topN) {
    const scoredIds = scored.map((r) => r.book.id);
    const remaining = books
      .filter((b) => !scoredIds.includes(b.id))
      .slice(0, topN - scored.length)
      .map((book) => ({ book, score: 0, explanation: '' }));
    return [...scored, ...remaining];
  }

  return scored;
}
