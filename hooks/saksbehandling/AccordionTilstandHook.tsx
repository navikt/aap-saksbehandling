import { useContext } from 'react';
import { AccordionTilstandContext } from 'context/saksbehandling/AccordionTilstandContext';

export function useAccordionTilstand() {
  const context = useContext(AccordionTilstandContext);

  if (!context) {
    throw new Error(
      'useAccordionTilstand må brukes innenfor AccordionTilstandProvider, wrap expandable cards i accordionGroup komponent'
    );
  }

  return context;
}
