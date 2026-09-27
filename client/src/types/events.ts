import type { Message } from './message';
import type { JoinRequest, User } from './user';

/** Events the client sends. Mirrors the server contract. */
export interface ClientToServerEvents {
  join: (payload: JoinRequest, callback: (error?: string) => void) => void;
  sendMessage: (text: string, callback?: (error?: string) => void) => void;
  leave: () => void;
}

/** Events the client listens for. */
export interface ServerToClientEvents {
  message: (message: Message) => void;
  roomUsers: (users: User[]) => void;
}
