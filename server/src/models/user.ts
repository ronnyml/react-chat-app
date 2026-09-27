import {
  MAX_USERNAME_LENGTH,
  ROOM_NOT_FOUND,
  USERNAME_TOO_LONG,
  USER_IN_USE,
  USER_ROOM_REQUIRED,
} from '../utils/constants';
import { resolveRoom } from '../utils/rooms';
import type { JoinRequest, User } from '../types/user';

export type AddUserResult = { user: User } | { error: string };

/**
 * Connected users, keyed by socket id. This lives in memory on purpose, so a
 * restart clears every room. Swap this module for a shared store (Redis) before
 * running more than one instance.
 */
const users = new Map<string, User>();

export const addUser = (id: string, request: JoinRequest): AddUserResult => {
  const username = request.username?.trim() ?? '';
  const requestedRoom = request.room?.trim() ?? '';

  if (!username || !requestedRoom) {
    return { error: USER_ROOM_REQUIRED };
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    return { error: USERNAME_TOO_LONG };
  }

  const room = resolveRoom(requestedRoom);
  if (!room) {
    return { error: ROOM_NOT_FOUND };
  }

  const isTaken = [...users.values()].some(
    (user) =>
      user.room === room && user.username.toLowerCase() === username.toLowerCase(),
  );
  if (isTaken) {
    return { error: USER_IN_USE };
  }

  const user: User = { id, username, room };
  users.set(id, user);
  return { user };
};

export const getUser = (id: string): User | undefined => users.get(id);

export const getUsersInRoom = (room: string): User[] =>
  [...users.values()]
    .filter((user) => user.room === room)
    .sort((a, b) => a.username.localeCompare(b.username));

export const removeUser = (id: string): User | undefined => {
  const user = users.get(id);
  if (user) {
    users.delete(id);
  }
  return user;
};

/** Test helper. Drops every connected user. */
export const resetUsers = (): void => {
  users.clear();
};
