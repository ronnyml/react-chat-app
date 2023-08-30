import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Sidebar from "../components/Sidebar";
import ChatBody from "components/ChatBody";

const Chat = ({ socket }: { socket: Socket }) => {
  const pageRef = useRef(false);
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") || '';
  const room = searchParams.get("room") || '';
  const join = searchParams.get("join");
  const user = { id: socket.id, username , room };

  useEffect(() => {
    if (pageRef.current) return;
    pageRef.current = true;

    if (join) {
      socket.emit("join", user, (error: any) => {
        if (error) {
          console.log(error);
        }
      });
    }
  }, [socket, username, room]);

  return (
    <div className="chat">
      <Sidebar socket={socket} joinedUser={user} />
      <ChatBody socket={socket} joinedUser={user} />
    </div>
  );
}

export default Chat;