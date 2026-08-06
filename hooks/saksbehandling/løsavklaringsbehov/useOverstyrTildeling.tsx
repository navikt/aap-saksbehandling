import { OverstyrTildelingContext } from 'context/saksbehandling/OverstyrTildelingContext';
import { useContext } from 'react';

export function useOverstyrTildelingNyHook() {
  const context = useContext(OverstyrTildelingContext);

  if (context) {
    return context;
  } else {
    throw new Error('useOverstyrTildelingNyHook må bli brukt på behandlingssiden.');
  }
}
