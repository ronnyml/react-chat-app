import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Message } from '@/types/message';

import { MessageList } from './MessageList';

const message = (username: string, text: string, minute = 0): Message => ({
  username,
  text,
  createdAt: `2026-01-15T10:${String(minute).padStart(2, '0')}:00.000Z`,
});

describe('MessageList', () => {
  it('shows a loading row while joining', () => {
    render(<MessageList messages={[]} currentUsername="Ronny" isJoining />);

    expect(screen.getByText('Joining the room')).toBeInTheDocument();
  });

  it('labels your own messages as You', () => {
    render(
      <MessageList
        messages={[message('Ronny', 'hi'), message('Ana', 'hello', 1)]}
        currentUsername="Ronny"
        isJoining={false}
      />,
    );

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('renders admin notices without an author', () => {
    render(
      <MessageList
        messages={[message('admin', 'Ana has joined')]}
        currentUsername="Ronny"
        isJoining={false}
      />,
    );

    expect(screen.getByText('Ana has joined')).toBeInTheDocument();
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
  });

  it('hides the author on back to back messages from the same person', () => {
    render(
      <MessageList
        messages={[message('Ana', 'first'), message('Ana', 'second')]}
        currentUsername="Ronny"
        isJoining={false}
      />,
    );

    expect(screen.getAllByText('Ana')).toHaveLength(1);
    expect(screen.getByText('second')).toBeInTheDocument();
  });
});
