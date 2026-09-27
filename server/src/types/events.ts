import type { Message } from './message';
import type { JoinRequest, User } from './user';

export interface ClientToServerEvents {
  join: (payload: JoinRequest, callback: (error?: string) => void) => void;
  sendMessage: (text: string, callback?: (error?: string) => void) => void;
  leave: () => void;
}

export interface ServerToClientEvents {
  message: (message: Message) => void;
  roomUsers: (users: User[]) => void;
}
