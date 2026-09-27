import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ChatHeader } from '@/components/ChatHeader';
import { Composer } from '@/components/Composer';
import { MessageList } from '@/components/MessageList';
import { Sidebar } from '@/components/Sidebar';
import { useChatRoom } from '@/hooks/useChatRoom';
import { useConnection } from '@/hooks/useConnection';

interface ChatRoomProps {
  username: string;
  room: string;
  onSelectRoom: (room: string) => void;
}

export const ChatRoom = ({ username, room, onSelectRoom }: ChatRoomProps) => {
  const navigate = useNavigate();
  const isConnected = useConnection();
  const { messages, users, status, error, sendMessage, leave } = useChatRoom(
    username,
    room,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSelectRoom = (nextRoom: string) => {
    setIsSidebarOpen(false);
    if (nextRoom.toLowerCase() === room.toLowerCase()) return;

    onSelectRoom(nextRoom);
  };

  const handleLeave = () => {
    leave();
    navigate('/');
  };

  if (status === 'error') {
    return (
      <main className="join">
        <section className="join-card">
          <h1 className="join-title">Cannot join this room</h1>
          <p className="alert" role="alert">
            {error ?? 'Something went wrong.'}
          </p>
          <Link className="button button-block" to="/">
            Back to join
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="chat">
      {isSidebarOpen && (
        <button
          type="button"
          className="scrim"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      <Sidebar
        currentRoom={room}
        currentUsername={username}
        users={users}
        isOpen={isSidebarOpen}
        onSelectRoom={handleSelectRoom}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="chat-main">
        <ChatHeader
          room={room}
          memberCount={users.length}
          isConnected={isConnected}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
          onLeave={handleLeave}
        />

        <MessageList
          messages={messages}
          currentUsername={username}
          isJoining={status === 'joining'}
        />

        <Composer
          room={room}
          disabled={!isConnected || status !== 'joined'}
          onSend={sendMessage}
        />
      </main>
    </div>
  );
};
