'use client';

import { useEffect } from 'react';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  flyt: BehandlingFlytOgTilstand;
};

/**
 * Om flyten ikke står med START_BEHANDLING som aktiv gruppe vil denne komponented redirect til den aktive gruppen
 */
export const StartBehandlingRedirectRiktigGruppe = ({ flyt }: Props) => {
  const router = useRouter();
  const { saksnummer, behandlingsreferanse } = useParams<{ saksnummer: string; behandlingsreferanse: string }>();

  useEffect(() => {
    if (flyt.aktivGruppe !== 'START_BEHANDLING') {
      router.push(`/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}/${flyt.aktivGruppe}`);
    }
  }, [flyt.aktivGruppe, router, saksnummer, behandlingsreferanse]);

  return null;
};
