import { User } from "interfaces/user.interface";
import { USER_ROOM_REQUIRED, USER_IN_USE } from "utils/constants";

const users: User[] = [];

export const addUser = (user: User): User | { error: string } => {
  const { id, username, room } = user;
  const lowerCaseUsername = username.trim().toLowerCase();
  const lowerCaseRoom = room.trim().toLowerCase();

  if (!lowerCaseUsername || !lowerCaseRoom) {
    return { error: USER_ROOM_REQUIRED };
  }

  const isUserInRoom = users.some(u => u.room === lowerCaseRoom && u.username === lowerCaseUsername);
  if (isUserInRoom) {
    return { error: USER_IN_USE };
  }

  const newUser: User = { ...user, id, username: lowerCaseUsername, room: lowerCaseRoom };
  users.push(newUser);
  return newUser;
};


export const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.id === userId);
};

export const getUsers = () => {
  return users;
};

export const getUsersInRoom = (room: string): User[] => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

export const removeUser = (userId: string): User | undefined => {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
