import { useContext } from 'react';
import { AccordionTilstandContext } from 'context/saksbehandling/AccordionTilstandContext';

export function useGloablAccordionTilstand() {
  const context = useContext(AccordionTilstandContext);

  if (!context) {
    throw new Error('useAccordionTilstand må brukes innenfor AccordionTilstandProvider');
  }

  return context;
}
