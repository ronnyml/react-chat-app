import type { Message } from '../types/message';

export const generateMessage = (username: string, text: string): Message => ({
  username,
  text,
  createdAt: new Date().toISOString(),
});
