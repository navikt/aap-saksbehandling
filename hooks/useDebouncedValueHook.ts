import { useEffect, useState } from 'react';

// Forsinker en state oppdatering for å optimalisere dyre operasjoner som ikke bør trigges for ofte.
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
