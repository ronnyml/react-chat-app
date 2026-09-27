/** Rooms offered in the UI. The server keeps the same list and rejects others. */
export const rooms = [
  'Announcements',
  'General',
  'Marketing',
  'Movies',
  'Products',
  'Programming',
  'Reading',
  'Remote',
] as const;

export type Room = (typeof rooms)[number];
