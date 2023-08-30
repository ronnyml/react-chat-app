import { useState } from 'react';
import { Socket } from "socket.io-client";
import { User } from 'interfaces/user.interface';
import rooms from "data/rooms";

const Sidebar = ({ socket, joinedUser }: { socket: Socket, joinedUser: User }) => {
  const [users, setUsers] = useState<User[]>([]);
  socket.on("roomUsers", (data: User[]) => setUsers(data));

  return (
    <div className="sidebar">
      <h2 className="room-title">React Chat App</h2>
      <h3 className="list-title">Rooms</h3>
      <ul className="rooms">
        {rooms.map((room, index) => (
          <div key={index}>
            {room.name.toLowerCase() === joinedUser?.room.toLowerCase() ? 
              <li className="room room-used">
                # {room.name}
              </li> : 
              <li className="room">
                <a href={`/chat?username=${joinedUser?.username}&room=${room.name}&join=true`}>
                  # {room.name}
                </a>
              </li>
            }
          </div>
        ))}
      </ul>
      <h3 className="list-title">People</h3>
      <ul className="users">
        {users.map((user) => (
          <li key={user.id} className="user">
            {user.username} {user.username === joinedUser?.username ? "(you)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;