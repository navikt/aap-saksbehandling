'use client';

import { Behovstype } from 'lib/utils/form';
import { clientHentMellomlagring, clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagredeVurderingResponse } from 'lib/types/types';
import { useState } from 'react';

export function useMellomlagring(
  behovstype: Behovstype,
  initialMellomlagring?: MellomlagredeVurderingResponse['mellomlagretVurdering']
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: () => void;
  mellomlagring?: MellomlagredeVurderingResponse['mellomlagretVurdering'];
} {
  const [mellomlagring, setMellomlagring] = useState<
    MellomlagredeVurderingResponse['mellomlagretVurdering'] | undefined
  >(initialMellomlagring);

  const behandlingsReferanse = useBehandlingsReferanse();

  async function lagreMellomlagring(vurdering: object) {
    const res = await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
    });

    if (isSuccess(res)) {
      clientHentMellomlagring({
        behandlingsreferanse: behandlingsReferanse,
        behovstype: behovstype,
      }).then((res) => isSuccess(res) && setMellomlagring(res.data.mellomlagretVurdering));
    }
  }

  async function slettMellomlagring() {
    const res = await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });

    if (isSuccess(res)) {
      setMellomlagring(undefined);
    }
  }

  return {
    lagreMellomlagring,
    slettMellomlagring,
    mellomlagring,
  };
}
