'use client';

import { useEffect } from 'react';
import { BehandlingFlytOgTilstand } from 'lib/types/types';
import { useRouter } from 'next/navigation';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

type Props = {
  flyt: BehandlingFlytOgTilstand;
};

/**
 * Om flyten ikke står med START_BEHANDLING som aktiv gruppe vil denne komponented redirect til den aktive gruppen
 */
export const StartBehandlingRedirectRiktigGruppe = ({ flyt }: Props) => {
  const router = useRouter();
  const { saksnummer, behandlingsreferanse } = useParamsMedType();

  useEffect(() => {
    if (flyt.aktivGruppe !== 'START_BEHANDLING') {
      router.push(`/saksbehandling/sak/${saksnummer}/${behandlingsreferanse}/${flyt.aktivGruppe}`);
    }
  }, [flyt.aktivGruppe, router, saksnummer, behandlingsreferanse]);

  return null;
};
