import { useSyncExternalStore } from 'react';

import { socket } from '@/lib/socket';

const subscribe = (onStoreChange: () => void) => {
  socket.on('connect', onStoreChange);
  socket.on('disconnect', onStoreChange);

  return () => {
    socket.off('connect', onStoreChange);
    socket.off('disconnect', onStoreChange);
  };
};

const getSnapshot = () => socket.connected;

/**
 * Tracks whether the socket is connected.
 *
 * This reads through useSyncExternalStore so a connection that lands between
 * the first render and the subscription is not missed.
 */
export const useConnection = (): boolean => useSyncExternalStore(subscribe, getSnapshot);
