import { useState } from 'react';

const MAX_MESSAGE_LENGTH = 500;

interface ComposerProps {
  room: string;
  disabled: boolean;
  onSend: (text: string) => void;
}

export const Composer = ({ room, disabled, onSend }: ComposerProps) => {
  const [text, setText] = useState('');
  const remaining = MAX_MESSAGE_LENGTH - text.length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || disabled) return;

    onSend(text);
    setText('');
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="message">
        Message
      </label>
      <input
        id="message"
        name="message"
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={disabled ? 'Connecting...' : `Message #${room}`}
        maxLength={MAX_MESSAGE_LENGTH}
        autoComplete="off"
        disabled={disabled}
      />
      {remaining < 80 && (
        <span className="char-count" aria-live="polite">
          {remaining}
        </span>
      )}
      <button type="submit" className="button" disabled={disabled || !text.trim()}>
        Send
      </button>
    </form>
  );
};
