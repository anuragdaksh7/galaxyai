import { RefObject, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [RefObject<T | null>, RefObject<T | null>, () => void] {
  const containerRef = useRef<T | null>(null);
  const endRef = useRef<T | null>(null);

  // Manually scroll to bottom function
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return [containerRef, endRef, scrollToBottom];
}
