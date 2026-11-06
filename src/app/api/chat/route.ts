import { NextRequest, NextResponse } from 'next/server';
import { generateResponse } from '@/lib/llm';
import { buildPrompt } from '@/lib/buildPrompt';
import { characters } from '@/data/characters';
import { Message } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { characterId, messages } = await req.json() as {
      characterId: string;
      messages: Message[];
    };

    const character = characters.find((c) => c.id === characterId);
    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    const systemPrompt = buildPrompt(character);

    // Convert messages to Gemini format (all except last user message = history)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 });
    }

    const stream = await generateResponse(systemPrompt, history, lastMessage.content);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
