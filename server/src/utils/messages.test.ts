import { describe, expect, it } from 'vitest';

import { generateMessage } from './messages';

describe('generateMessage', () => {
  it('keeps the username and text and adds an ISO timestamp', () => {
    const message = generateMessage('ronny', 'hello');

    expect(message.username).toBe('ronny');
    expect(message.text).toBe('hello');
    expect(new Date(message.createdAt).toISOString()).toBe(message.createdAt);
  });
});
