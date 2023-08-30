import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import rooms from "../data/rooms";

interface FormData {
  username: string;
  room: string;
}

const Home = ({ socket }: { socket: Socket }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    room: rooms[0].name
  });
  const { username, room } = formData;
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && room) {
      const user = { id: socket.id, username, room };
      socket.emit("join", user, (error: any) => {
        if (error) {
          setError(true);
        } else {
          setError(false);
          navigate(`/chat?username=${username}&room=${room}`);
        }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setError(false);
  };

  return (
    <div className="centered-form">
      <div className="centered-form-box">
        <h1>Join</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleChange}
            required />

          <select 
            name="room" 
            value={room}
            onChange={handleChange}
            required >
            {rooms.map((room, index) => (
              <option key={index} value={room.name}>
                {room.name}
              </option>
            )
            )}
          </select>
          <button>Join</button>
        </form>
        {error && <p style={{padding: '5px'}}>This user is already in use. Choose another one.</p>}
      </div>
    </div>
  )
}

export default Home;