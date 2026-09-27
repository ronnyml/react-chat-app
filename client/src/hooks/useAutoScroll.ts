import { useEffect, useRef } from 'react';

/**
 * Keeps a scroll container pinned to the bottom as items arrive, unless the
 * reader has scrolled up to look at older messages.
 */
export const useAutoScroll = <T>(items: T[]) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldStickRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      shouldStickRef.current = distanceFromBottom < 80;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !shouldStickRef.current) return;

    container.scrollTop = container.scrollHeight;
  }, [items]);

  return containerRef;
};
