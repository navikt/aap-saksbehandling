import { useContext } from 'react';
import { SakContext } from 'context/saksbehandling/SakContext';

export function useSak() {
  const sak = useContext(SakContext);
  if (sak) {
    return sak;
  } else {
    throw new Error('useSak kan bare brukes på behandlingsiden');
  }
}
