import { useSearchParams } from 'react-router-dom';

import { ChatRoom } from '@/components/ChatRoom';

/**
 * Reads the room from the URL and mounts the room view with a key, so every
 * room starts with its own state.
 */
export const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get('username') ?? '';
  const room = searchParams.get('room') ?? '';

  const handleSelectRoom = (nextRoom: string) => {
    setSearchParams({ username, room: nextRoom });
  };

  return (
    <ChatRoom
      key={`${username}:${room}`}
      username={username}
      room={room}
      onSelectRoom={handleSelectRoom}
    />
  );
};
