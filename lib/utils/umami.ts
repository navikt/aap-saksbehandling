import { useEffect, useRef } from 'react';

type UmamiValue = string | number | boolean | null;
type UmamiData = Record<string, UmamiValue>;

export const loggUmamiEvent = (eventName: string, data: UmamiData) => {
  if (typeof window === 'undefined') return;

  window.umami?.track(eventName, data);
};

export function useUmamiStartTidspunkt(): number {
  const umamiStartTidspunkt = useRef<number | null>(null);

  useEffect(() => {
    umamiStartTidspunkt.current = Date.now();
  }, []);

  return umamiStartTidspunkt.current ?? 0;
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data: UmamiData) => void;
    };
  }
}
