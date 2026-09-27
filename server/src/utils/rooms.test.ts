import { describe, expect, it } from 'vitest';

import { ROOMS, resolveRoom } from './rooms';

describe('resolveRoom', () => {
  it('resolves a room regardless of casing or padding', () => {
    expect(resolveRoom('  general ')).toBe('General');
  });

  it('returns undefined for an unknown room', () => {
    expect(resolveRoom('nowhere')).toBeUndefined();
  });

  it('resolves every room on the list', () => {
    for (const room of ROOMS) {
      expect(resolveRoom(room)).toBe(room);
    }
  });
});
