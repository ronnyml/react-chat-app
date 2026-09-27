export interface Message {
  username: string;
  text: string;
  /** ISO 8601 timestamp from the server. */
  createdAt: string;
}
