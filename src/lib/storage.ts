import { ChatHistory, UserInterests } from '@/types';

const CHAT_PREFIX = 'litai_chat_';
const INTERESTS_KEY = 'litai_interests';

export function saveChat(history: ChatHistory): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    `${CHAT_PREFIX}${history.characterId}`,
    JSON.stringify(history)
  );
}

export function loadChat(characterId: string): ChatHistory | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`${CHAT_PREFIX}${characterId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ChatHistory;
  } catch {
    return null;
  }
}

export function clearChat(characterId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${CHAT_PREFIX}${characterId}`);
}

export function getAllChatIds(): string[] {
  if (typeof window === 'undefined') return [];
  const ids: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CHAT_PREFIX)) {
      ids.push(key.replace(CHAT_PREFIX, ''));
    }
  }
  return ids;
}

export function saveInterests(interests: UserInterests): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
}

export function loadInterests(): UserInterests | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(INTERESTS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInterests;
  } catch {
    return null;
  }
}
