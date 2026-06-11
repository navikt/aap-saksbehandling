import { useContext } from 'react';
import { SakPersoninformasjonContext } from 'context/saksbehandling/SakPersoninformasjonContext';

export function useSakPersonInformasjon() {
  const context = useContext(SakPersoninformasjonContext);

  if (!context) {
    throw new Error('useSakPersonInformasjon kan bare brukes inne på en sak.');
  } else {
    return context;
  }
}
