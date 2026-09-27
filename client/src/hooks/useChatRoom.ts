import { useCallback, useEffect, useState } from 'react';

import { socket } from '@/lib/socket';
import type { Message } from '@/types/message';
import type { User } from '@/types/user';

export type RoomStatus = 'joining' | 'joined' | 'error';

interface ChatRoom {
  messages: Message[];
  users: User[];
  status: RoomStatus;
  error: string | null;
  sendMessage: (text: string) => void;
  leave: () => void;
}

const MISSING_PARAMS = 'Pick a username and a room to start chatting.';

/**
 * Joins a room and keeps its messages and member list in sync, re-joining
 * automatically after a reconnect.
 *
 * State is per room by design: mount this with a `key` that includes the room,
 * so switching rooms gives a clean slate instead of mixing conversations.
 */
export const useChatRoom = (username: string, room: string): ChatRoom => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<RoomStatus>('joining');
  const [error, setError] = useState<string | null>(null);
  const hasParams = Boolean(username && room);

  useEffect(() => {
    if (!hasParams) return;

    const onMessage = (message: Message) => {
      setMessages((previous) => [...previous, message]);
    };
    const onRoomUsers = (roomUsers: User[]) => setUsers(roomUsers);
    const join = () => {
      socket.emit('join', { username, room }, (joinError) => {
        if (joinError) {
          setError(joinError);
          setStatus('error');
          return;
        }
        setStatus('joined');
      });
    };

    socket.on('message', onMessage);
    socket.on('roomUsers', onRoomUsers);
    socket.on('connect', join);

    if (socket.connected) {
      join();
    } else {
      socket.connect();
    }

    return () => {
      socket.off('message', onMessage);
      socket.off('roomUsers', onRoomUsers);
      socket.off('connect', join);
    };
  }, [hasParams, username, room]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    socket.emit('sendMessage', trimmed, (sendError) => {
      if (sendError) setError(sendError);
    });
  }, []);

  const leave = useCallback(() => {
    socket.emit('leave');
  }, []);

  return {
    messages,
    users,
    status: hasParams ? status : 'error',
    error: hasParams ? error : MISSING_PARAMS,
    sendMessage,
    leave,
  };
};
