import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from "socket.io-client";
import { Message } from 'interfaces/message.interface';
import { User } from 'interfaces/user.interface';

const ChatBody = ({ socket, joinedUser }: { socket: Socket, joinedUser: User }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("message", (data: Message) => setMessages([...messages, data]));
  }, [socket, messages]);

  const handleLeaveChat = () => {
    navigate("/");
    window.location.reload();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", message.trim());
    }
    setMessage("");
  };

  return (
    <div className="chat-main">
      <div className="flex-container header">
        <div>
          <h2 className="current-room"># {joinedUser?.room}</h2>
        </div>
        <div id="leave-chat">
          <button onClick={handleLeaveChat}>Leave chat</button>
        </div>
      </div>

      <div id="messages" className="chat-messages">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <p>
              <span className="message-username">{message.username}</span>
              <span className="message-time">{message.createdAt}</span>
            </p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="compose">
        <form onSubmit={handleSendMessage}>
          <input
            placeholder="Write message"
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="off"
            required
          />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatBody;