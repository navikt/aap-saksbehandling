import { useContext } from 'react';
import { IngenFlereOppgaverModalContext } from 'context/saksbehandling/IngenFlereOppgaverModalContext';

export function useIngenFlereOppgaverModal() {
  const context = useContext(IngenFlereOppgaverModalContext);

  if (context) {
    return context;
  } else {
    throw new Error('useIngenFlereOppgaverModal må bli brukt på behandlingssiden.');
  }
}
