import { RefObject, useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [RefObject<T>, RefObject<T>, () => void] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  // Manually scroll to bottom function
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return [containerRef, endRef, scrollToBottom];
}
