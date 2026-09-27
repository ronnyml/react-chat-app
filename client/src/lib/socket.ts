import { io, type Socket } from 'socket.io-client';

import type { ClientToServerEvents, ServerToClientEvents } from '@/types/events';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * One socket for the whole app. It is created once on import and reused across
 * routes, so switching rooms does not drop the connection.
 */
export const socket: ChatSocket = io(API_URL, {
  autoConnect: true,
  reconnectionDelay: 500,
});
