import { rooms } from '@/data/rooms';
import type { User } from '@/types/user';

import { Avatar } from './Avatar';

interface SidebarProps {
  currentRoom: string;
  currentUsername: string;
  users: User[];
  isOpen: boolean;
  onSelectRoom: (room: string) => void;
  onClose: () => void;
}

export const Sidebar = ({
  currentRoom,
  currentUsername,
  users,
  isOpen,
  onSelectRoom,
  onClose,
}: SidebarProps) => (
  <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} id="sidebar">
    <div className="sidebar-head">
      <span className="brand">
        <span className="brand-mark" aria-hidden="true" />
        React Chat
      </span>
      <button type="button" className="icon-button sidebar-close" onClick={onClose}>
        <span aria-hidden="true">✕</span>
        <span className="sr-only">Close menu</span>
      </button>
    </div>

    <nav className="sidebar-section" aria-label="Rooms">
      <h2 className="sidebar-title">Rooms</h2>
      <ul className="room-list">
        {rooms.map((room) => {
          const isCurrent = room.toLowerCase() === currentRoom.toLowerCase();

          return (
            <li key={room}>
              <button
                type="button"
                className={`room ${isCurrent ? 'is-current' : ''}`}
                onClick={() => onSelectRoom(room)}
                aria-current={isCurrent ? 'page' : undefined}
              >
                <span className="room-hash" aria-hidden="true">
                  #
                </span>
                {room}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>

    <div className="sidebar-section">
      <h2 className="sidebar-title">
        People
        <span className="count">{users.length}</span>
      </h2>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user">
            <Avatar username={user.username} />
            <span className="user-name">{user.username}</span>
            {user.username === currentUsername && <span className="tag">you</span>}
          </li>
        ))}
      </ul>
    </div>
  </aside>
);
