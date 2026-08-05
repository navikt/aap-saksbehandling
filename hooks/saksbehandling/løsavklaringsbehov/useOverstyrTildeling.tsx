import { useContext } from 'react';
import { OverstyrTildelingContext } from 'context/saksbehandling/OverstyrTildelingContext';

export function useOverstyrTildelingNyHook() {
  const context = useContext(OverstyrTildelingContext);

  if (context) {
    return context;
  } else {
    throw new Error('useOverstyrTildelingNyHook må bli brukt på behandlingssiden.');
  }
}
