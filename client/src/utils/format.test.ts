import { describe, expect, it } from 'vitest';

import { formatTime, getAvatarHue, getInitial } from './format';

describe('formatTime', () => {
  it('formats an ISO timestamp as a short time', () => {
    expect(formatTime('2026-01-15T15:07:00.000Z')).toMatch(/\d{1,2}:\d{2}/);
  });

  it('returns an empty string for junk input', () => {
    expect(formatTime('not-a-date')).toBe('');
  });
});

describe('getInitial', () => {
  it('uppercases the first letter', () => {
    expect(getInitial('ronny')).toBe('R');
  });

  it('falls back when the name is blank', () => {
    expect(getInitial('   ')).toBe('?');
  });
});

describe('getAvatarHue', () => {
  it('is stable for the same name', () => {
    expect(getAvatarHue('ronny')).toBe(getAvatarHue('ronny'));
  });

  it('stays inside the hue range', () => {
    for (const name of ['a', 'ronny', 'a-very-long-username-here']) {
      const hue = getAvatarHue(name);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    }
  });
});
