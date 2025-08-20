'use client';

import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomLagretVurdering } from 'lib/types/types';
import { Dispatch, SetStateAction, useState } from 'react';

export function useMellomlagring(
  behovstype: Behovstype,
  initialMellomlagring?: MellomLagretVurdering
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: () => void;
  mellomlagring?: MellomLagretVurdering;
  setMellomlagring: Dispatch<SetStateAction<MellomLagretVurdering | undefined>>;
} {
  const [mellomlagring, setMellomlagring] = useState<MellomLagretVurdering | undefined>(initialMellomlagring);

  const behandlingsReferanse = useBehandlingsReferanse();

  async function lagreMellomlagring(vurdering: object) {
    const res = await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
    });

    if (isSuccess(res)) {
      setMellomlagring(res.data.mellomlagretVurdering);
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
    setMellomlagring,
    mellomlagring,
  };
}
