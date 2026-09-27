import { beforeEach, describe, expect, it } from 'vitest';

import { addUser, getUser, getUsersInRoom, removeUser, resetUsers } from './user';
import { ROOM_NOT_FOUND, USER_IN_USE, USER_ROOM_REQUIRED } from '../utils/constants';

const join = (id: string, username: string, room = 'General') =>
  addUser(id, { username, room });

describe('user store', () => {
  beforeEach(() => {
    resetUsers();
  });

  it('adds a user and keeps the name as typed', () => {
    const result = join('socket-1', '  Ronny  ');

    expect(result).toEqual({
      user: { id: 'socket-1', username: 'Ronny', room: 'General' },
    });
    expect(getUser('socket-1')?.username).toBe('Ronny');
  });

  it('requires a username and a room', () => {
    expect(addUser('socket-1', { username: '', room: 'General' })).toEqual({
      error: USER_ROOM_REQUIRED,
    });
  });

  it('rejects rooms that are not on the list', () => {
    expect(join('socket-1', 'Ronny', 'Nowhere')).toEqual({ error: ROOM_NOT_FOUND });
  });

  it('accepts a room in any casing and stores the canonical name', () => {
    const result = join('socket-1', 'Ronny', 'gEnErAl');

    expect(result).toHaveProperty('user');
    expect(getUser('socket-1')?.room).toBe('General');
  });

  it('rejects a duplicate username in the same room, ignoring case', () => {
    join('socket-1', 'Ronny');

    expect(join('socket-2', 'ronny')).toEqual({ error: USER_IN_USE });
  });

  it('allows the same username in a different room', () => {
    join('socket-1', 'Ronny', 'General');

    expect(join('socket-2', 'Ronny', 'Movies')).toHaveProperty('user');
  });

  it('lists only the users in a room, sorted by name', () => {
    join('socket-1', 'Zoe');
    join('socket-2', 'Adam');
    join('socket-3', 'Someone', 'Movies');

    expect(getUsersInRoom('General').map((user) => user.username)).toEqual([
      'Adam',
      'Zoe',
    ]);
  });

  it('removes a user and returns them', () => {
    join('socket-1', 'Ronny');

    expect(removeUser('socket-1')?.username).toBe('Ronny');
    expect(getUser('socket-1')).toBeUndefined();
    expect(getUsersInRoom('General')).toEqual([]);
  });

  it('returns undefined when removing someone who is not connected', () => {
    expect(removeUser('missing')).toBeUndefined();
  });
});
