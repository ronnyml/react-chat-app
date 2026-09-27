export interface User {
  id: string;
  username: string;
  room: string;
}

export interface JoinRequest {
  username: string;
  room: string;
}
