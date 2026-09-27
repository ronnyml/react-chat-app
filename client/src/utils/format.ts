const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});

/** Formats an ISO timestamp as a short local time, e.g. "3:07 PM". */
export const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? '' : timeFormatter.format(date);
};

/** First letter of a username, used for avatars. */
export const getInitial = (username: string): string =>
  username.trim().charAt(0).toUpperCase() || '?';

/**
 * Picks one of the avatar colors from a username, so the same person always
 * gets the same color.
 */
export const getAvatarHue = (username: string): number => {
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = (hash * 31 + username.charCodeAt(i)) % 360;
  }
  return hash;
};
