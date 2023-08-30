import express, { Application, Request, Response } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { generateMessage } from "utils/messages";
import { 
  ADMIN_USER, 
  USER_CONNECTED, 
  USER_DISCONNECTED, 
  USER_JOINED, 
  USER_LEFT, 
  WELCOME_MESSAGE
} from "utils/constants";
import { User } from "interfaces/user.interface";
import { addUser, getUser, getUsersInRoom, removeUser, getUsers } from "models/user";

const app: Application = express();
const server = http.createServer(app);
app.use(cors());

const socketIO = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});

socketIO.on("connection", (socket: any) => {
  console.log(`${socket.id} ${USER_CONNECTED}`);
  socket.on("sendMessage", (message: string) => {
    const user = getUser(socket.id);
    socketIO.to(user.room).emit(
      "message",
      generateMessage(user.username, message)
    );
  });

  socket.on("join", (userData: User, callback: (error?: string) => void) => {
    const user = addUser(userData);
    if ("error" in user) {
      callback(user.error);
      return;
    }

    callback();
    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage(ADMIN_USER, WELCOME_MESSAGE)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage(ADMIN_USER, `${user.username} ${USER_JOINED}`)
      );
    socketIO.to(user.room).emit("roomUsers", getUsersInRoom(user.room));
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      socketIO.to(user.room).emit(
        "message",
        generateMessage(ADMIN_USER, `${user.username} ${USER_LEFT}`)
      );
      socketIO.to(user.room).emit("roomUsers", getUsersInRoom(user.room));
    }
    console.log(`${socket.id} ${USER_DISCONNECTED}`);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Chat API");
});

export { server };
