import { useContext } from 'react';
import { OverstyrTildelingContext } from 'context/saksbehandling/OverstyrTildelingContext';

export function useOverstyrTildelingHook() {
  const context = useContext(OverstyrTildelingContext);

  if (context) {
    return context;
  } else {
    throw new Error('useOverstyrTildeling må bli brukt på behandlingssiden.');
  }
}
