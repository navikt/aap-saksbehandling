'use client';

import { VStack } from '@navikt/ds-react';
import { BehandlingsHendelserTidslinje } from 'components/sakshistorikk/BehandlingsHendelserTidslinje';
import { useSaksHistorikk } from 'hooks/saksbehandling/SaksHistorikkHook';

export function SaksHistorikk() {
  const { historikk } = useSaksHistorikk();

  if (!historikk || historikk?.type === 'ERROR') return null;
  return (
    <section>
      <VStack gap={'2'}>
        {historikk.data.map((behandling, behandlingIndex) => (
          <BehandlingsHendelserTidslinje
            key={`behandling-${behandlingIndex}`}
            hendelser={behandling.hendelser}
            defaultKollapset={!(behandlingIndex === 0)}
          />
        ))}
      </VStack>
    </section>
  );
}
