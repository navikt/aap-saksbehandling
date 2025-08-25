'use client';

import useSWR from 'swr';
import { useSaksnummer } from 'hooks/saksbehandling/BehandlingHook';
import { clientHentSakshistorikk } from 'lib/clientApi';
import { VStack } from '@navikt/ds-react';
import { BehandlingsHendelserTidslinje } from 'components/sakshistorikk/BehandlingsHendelserTidslinje';

export function SaksHistorikk() {
  const saksnummer = useSaksnummer();
  const { data: saksHistorikk } = useSWR(`sak/${saksnummer}/historikk`, () => clientHentSakshistorikk(saksnummer));
  console.log('historikk', saksHistorikk);

  if (!saksHistorikk || saksHistorikk?.type === 'ERROR') return null;
  return (
    <section>
      <VStack gap={'2'}>
        {saksHistorikk.data.map((behandling, behandlingIndex) => (
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
