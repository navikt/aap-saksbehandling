import { useContext } from 'react';
import { AccordionTilstandContext } from 'context/saksbehandling/AccordionTilstandContext';
import { useParams } from 'next/navigation';

export function useAccordionTilstand() {
  const params = useParams<{ aktivGruppe: string }>();
  const context = useContext(AccordionTilstandContext);

  if (!context) {
    throw new Error(
      `useAccordionTilstand kan bare brukes innenfor AccordionTilstandProvider. Sørg for at NyVurderingExpandableCard er pakket inn i AccordionTilstandProvider. Denne feilen skjer i et vilkårskort i steggruppen ${params.aktivGruppe}`
    );
  }

  return context;
}
