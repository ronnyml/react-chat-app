import { useAutoScroll } from '@/hooks/useAutoScroll';
import type { Message } from '@/types/message';
import { formatTime } from '@/utils/format';

import { Avatar } from './Avatar';

const ADMIN_USER = 'admin';

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  isJoining: boolean;
}

export const MessageList = ({
  messages,
  currentUsername,
  isJoining,
}: MessageListProps) => {
  const containerRef = useAutoScroll(messages);

  return (
    <div className="messages" ref={containerRef} aria-live="polite" aria-busy={isJoining}>
      {isJoining && (
        <div className="messages-loading">
          <span className="spinner" aria-hidden="true" />
          Joining the room
        </div>
      )}

      {messages.map((message, index) => {
        const isSystem = message.username === ADMIN_USER;
        const isOwn = !isSystem && message.username === currentUsername;
        const previous = messages[index - 1];
        const isGrouped =
          !isSystem &&
          previous?.username === message.username &&
          new Date(message.createdAt).getTime() - new Date(previous.createdAt).getTime() <
            60_000;

        if (isSystem) {
          return (
            <p className="system-message" key={`${message.createdAt}-${index}`}>
              {message.text}
            </p>
          );
        }

        return (
          <article
            className={`message ${isOwn ? 'is-own' : ''} ${isGrouped ? 'is-grouped' : ''}`}
            key={`${message.createdAt}-${index}`}
          >
            {!isGrouped && <Avatar username={message.username} />}
            <div className="message-body">
              {!isGrouped && (
                <p className="message-meta">
                  <span className="message-author">
                    {isOwn ? 'You' : message.username}
                  </span>
                  <time dateTime={message.createdAt}>
                    {formatTime(message.createdAt)}
                  </time>
                </p>
              )}
              <p className="message-text">{message.text}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
};
