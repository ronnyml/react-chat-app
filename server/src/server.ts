import http from 'node:http';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Application, type Request, type Response } from 'express';
import { Server, type Socket } from 'socket.io';

import { addUser, getUser, getUsersInRoom, removeUser } from './models/user';
import type { ClientToServerEvents, ServerToClientEvents } from './types/events';
import type { JoinRequest } from './types/user';
import {
  ADMIN_USER,
  MAX_MESSAGE_LENGTH,
  USER_JOINED,
  USER_LEFT,
  WELCOME_MESSAGE,
} from './utils/constants';
import { generateMessage } from './utils/messages';
import { ROOMS } from './utils/rooms';

dotenv.config({ quiet: true });

/**
 * Origins allowed to talk to this server. Accepts a comma separated list, so
 * one deployment can serve a local dev client and a hosted one.
 */
const allowedOrigins = (process.env.CLIENT_URL ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app: Application = express();
const server = http.createServer(app);

app.use(cors({ origin: allowedOrigins }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ name: 'React Chat API', status: 'ok' });
});

app.get('/api/rooms', (_req: Request, res: Response) => {
  res.json({ rooms: ROOMS });
});

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: { origin: allowedOrigins },
});

type ChatSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

const announce = (room: string, text: string) => {
  io.to(room).emit('message', generateMessage(ADMIN_USER, text));
};

/**
 * Removes the socket from whatever room it is in, if any. Called when a client
 * leaves, disconnects, or joins a different room.
 */
const handleLeave = (socket: ChatSocket) => {
  const user = removeUser(socket.id);
  if (!user) return;

  socket.leave(user.room);
  announce(user.room, `${user.username} ${USER_LEFT}`);
  io.to(user.room).emit('roomUsers', getUsersInRoom(user.room));
};

const handleJoin = (
  socket: ChatSocket,
  payload: JoinRequest,
  callback: (error?: string) => void,
) => {
  const current = getUser(socket.id);
  const isSameRoom =
    current?.room.toLowerCase() === payload.room?.trim().toLowerCase() &&
    current?.username.toLowerCase() === payload.username?.trim().toLowerCase();

  // Already here. Resend the member list and skip the join notices.
  if (current && isSameRoom) {
    callback();
    io.to(current.room).emit('roomUsers', getUsersInRoom(current.room));
    return;
  }

  // One socket is only ever in one room, so leave the old one first.
  handleLeave(socket);

  const result = addUser(socket.id, payload);

  if ('error' in result) {
    callback(result.error);
    return;
  }

  const { user } = result;
  socket.join(user.room);
  callback();

  socket.emit('message', generateMessage(ADMIN_USER, WELCOME_MESSAGE));
  socket.broadcast
    .to(user.room)
    .emit('message', generateMessage(ADMIN_USER, `${user.username} ${USER_JOINED}`));
  io.to(user.room).emit('roomUsers', getUsersInRoom(user.room));
};

const handleSendMessage = (
  socket: ChatSocket,
  text: string,
  callback?: (error?: string) => void,
) => {
  const user = getUser(socket.id);
  if (!user) {
    callback?.('Join a room before sending messages.');
    return;
  }

  const trimmed = typeof text === 'string' ? text.trim() : '';
  if (!trimmed) {
    callback?.('Message cannot be empty.');
    return;
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    callback?.(`Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`);
    return;
  }

  io.to(user.room).emit('message', generateMessage(user.username, trimmed));
  callback?.();
};

io.on('connection', (socket: ChatSocket) => {
  socket.on('join', (payload, callback) => handleJoin(socket, payload, callback));
  socket.on('sendMessage', (text, callback) => handleSendMessage(socket, text, callback));
  socket.on('leave', () => handleLeave(socket));
  socket.on('disconnect', () => handleLeave(socket));
});

export { app, io, server };
