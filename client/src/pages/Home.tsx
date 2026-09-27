import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { rooms } from '@/data/rooms';
import { socket } from '@/lib/socket';

const MAX_USERNAME_LENGTH = 20;

export const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState<string>(rooms[1]);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter a username.');
      return;
    }

    setError(null);
    setIsJoining(true);

    socket.emit('join', { username: trimmed, room }, (joinError) => {
      setIsJoining(false);

      if (joinError) {
        setError(joinError);
        return;
      }

      navigate(
        `/chat?username=${encodeURIComponent(trimmed)}&room=${encodeURIComponent(room)}`,
      );
    });

    if (!socket.connected) socket.connect();
  };

  return (
    <main className="join">
      <section className="join-card">
        <span className="brand brand-lg">
          <span className="brand-mark" aria-hidden="true" />
          React Chat
        </span>
        <h1 className="join-title">Join a room</h1>
        <p className="join-subtitle">
          Pick a name, choose a room, and start talking in real time.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError(null);
              }}
              placeholder="e.g. ronny"
              maxLength={MAX_USERNAME_LENGTH}
              autoComplete="off"
              autoFocus
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={error ? 'join-error' : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="room">Room</label>
            <select
              id="room"
              name="room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            >
              {rooms.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="button button-block" disabled={isJoining}>
            {isJoining ? 'Joining...' : 'Join room'}
          </button>
        </form>

        {error && (
          <p className="alert" id="join-error" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
};
