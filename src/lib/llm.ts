import { GoogleGenerativeAI } from '@google/generative-ai';

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return key;
}

const MODEL_NAME = 'gemini-3.5-flash-lite';

export async function generateResponse(
  systemPrompt: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string
): Promise<ReadableStream<Uint8Array>> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: {
      role: 'system',
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.9,
    },
  });

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessageStream(userMessage);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (err) {
        console.error('Error during chunk streaming:', err);
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

export async function generateText(prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(getApiKey());
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}
