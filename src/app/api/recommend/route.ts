import { NextRequest, NextResponse } from 'next/server';
import { getTopBooks } from '@/lib/recommender';
import { generateText } from '@/lib/llm';
import { UserInterests, BookRecommendation } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const interests = await req.json() as UserInterests;

    const topBooks = getTopBooks(interests, 5);

    // Build prompt for LLM to explain recommendations
    const booksDescription = topBooks
      .map(
        (r, i) =>
          `${i + 1}. «${r.book.title}» — ${r.book.author} (${r.book.year})\n   Темы: ${r.book.themes.join(', ')}\n   ${r.book.description}`
      )
      .join('\n\n');

    const userProfile = [
      interests.genres.length ? `Любимые жанры: ${interests.genres.join(', ')}` : '',
      interests.themes.length ? `Интересные темы: ${interests.themes.join(', ')}` : '',
      interests.mood.length ? `Настроение: ${interests.mood.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('. ');

    const llmPrompt = `Ты — литературный консультант. Объясни пользователю, почему каждая из этих книг подойдёт именно ему.

Профиль пользователя: ${userProfile || 'не указан'}

Книги для объяснения:
${booksDescription}

Для каждой книги напиши персональное объяснение в 1–2 предложениях, почему она подходит этому пользователю.
Начинай каждое объяснение с порядкового номера и названия книги в кавычках.
Формат: "1. «Название»: объяснение."
Пиши по-русски, тепло и вдохновляюще.`;

    const explanationsRaw = await generateText(llmPrompt);

    // Parse explanations from LLM response
    const explanationLines = explanationsRaw.split('\n').filter((l) => l.trim());
    const recommendations: BookRecommendation[] = topBooks.map((r, i) => {
      const line = explanationLines.find((l) => l.startsWith(`${i + 1}.`));
      const explanation = line
        ? line.replace(/^\d+\.\s*«[^»]+»:\s*/, '').trim()
        : r.book.description;
      return { ...r, explanation };
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommend API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
