export interface Message {
  username: string;
  text: string;
  /** ISO 8601 timestamp. The client decides how to display it. */
  createdAt: string;
}
