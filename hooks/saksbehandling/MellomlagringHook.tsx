'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagretVurdering } from 'lib/types/types';
import { useState } from 'react';

export function useMellomlagring(
  behovstype: Behovstype,
  initialMellomlagring?: MellomlagretVurdering
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: (callback?: () => void) => void;
  mellomlagretVurdering?: MellomlagretVurdering;
  nullstillMellomlagretVurdering: () => void;
} {
  const behandlingsReferanse = useBehandlingsReferanse();
  const [mellomlagretVurdering, setMellomlagretVurdering] = useState<MellomlagretVurdering | undefined>(
    initialMellomlagring
  );

  async function lagreMellomlagring(vurdering: object) {
    const res = await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
    });

    if (isSuccess(res)) {
      setMellomlagretVurdering(res.data.mellomlagretVurdering);
    }
  }

  async function slettMellomlagring(callback?: () => void) {
    const res = await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });

    if (isSuccess(res)) {
      setMellomlagretVurdering(undefined);
      if (callback) {
        callback();
      }
    }
  }

  function nullstillMellomlagretVurdering() {
    setMellomlagretVurdering(undefined);
  }

  return {
    lagreMellomlagring,
    slettMellomlagring,
    nullstillMellomlagretVurdering,
    mellomlagretVurdering,
  };
}
