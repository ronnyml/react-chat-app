export interface User {
  id: string;
  username: string;
  room: string;
}

/** What the client sends when joining. The server assigns the id itself. */
export interface JoinRequest {
  username: string;
  room: string;
}
