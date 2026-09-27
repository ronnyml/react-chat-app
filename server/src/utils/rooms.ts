/**
 * The rooms the server accepts. The client renders the same list, so keep the
 * two in sync when adding a room.
 */
export const ROOMS = [
  'Announcements',
  'General',
  'Marketing',
  'Movies',
  'Products',
  'Programming',
  'Reading',
  'Remote',
] as const;

const ROOMS_BY_KEY = new Map(ROOMS.map((room) => [room.toLowerCase(), room]));

/** Returns the canonical room name, or undefined when the room is unknown. */
export const resolveRoom = (room: string): string | undefined =>
  ROOMS_BY_KEY.get(room.trim().toLowerCase());
