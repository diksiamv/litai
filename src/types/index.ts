export interface Character {
  id: string;
  name: string;
  work: string;
  author: string;
  year: number;
  portrait: string;
  tagline: string;
  personality: string;
  speechStyle: string;
  worldview: string;
  keyEvents: string[];
  relationships: Record<string, string>;
  knowledgeBoundary: string;
  suggestedQuestions: string[];
  genres: string[];
  themes: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genres: string[];
  themes: string[];
  mood: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  similarTo: string[]; // character ids
  description: string;
  characterId?: string; // linked character for "Talk to hero" button
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  characterId: string;
  messages: Message[];
  lastUpdated: number;
}

export interface UserInterests {
  genres: string[];
  themes: string[];
  favoriteCharacters: string[];
  mood: string[];
}

export interface BookRecommendation {
  book: Book;
  score: number;
  explanation: string;
}
