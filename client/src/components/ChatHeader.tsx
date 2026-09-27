import { ConnectionBadge } from './ConnectionBadge';

interface ChatHeaderProps {
  room: string;
  memberCount: number;
  isConnected: boolean;
  onToggleSidebar: () => void;
  onLeave: () => void;
}

export const ChatHeader = ({
  room,
  memberCount,
  isConnected,
  onToggleSidebar,
  onLeave,
}: ChatHeaderProps) => (
  <header className="chat-header">
    <button
      type="button"
      className="icon-button sidebar-toggle"
      onClick={onToggleSidebar}
      aria-controls="sidebar"
    >
      <span aria-hidden="true">☰</span>
      <span className="sr-only">Open menu</span>
    </button>

    <div className="chat-header-text">
      <h1 className="room-name">
        <span className="room-hash" aria-hidden="true">
          #
        </span>
        {room}
      </h1>
      <p className="room-meta">
        {memberCount} {memberCount === 1 ? 'person' : 'people'} here
      </p>
    </div>

    <ConnectionBadge isConnected={isConnected} />

    <button type="button" className="button button-ghost" onClick={onLeave}>
      Leave
    </button>
  </header>
);
