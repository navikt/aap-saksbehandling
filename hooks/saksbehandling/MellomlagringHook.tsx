'use client';

import { Behovstype } from 'lib/utils/form';
import { clientHentMellomlagring, clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { isSuccess } from 'lib/utils/api';
import { MellomlagredeVurderingResponse } from 'lib/types/types';
import useSWR from 'swr';

export function useMellomlagring(
  behovstype: Behovstype,
  mellomlagring?: MellomlagredeVurderingResponse['mellomlagretVurdering']
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: () => void;
  mellomlagring?: MellomlagredeVurderingResponse['mellomlagretVurdering'];
} {
  const behandlingsReferanse = useBehandlingsReferanse();

  const { data: response, mutate } = useSWR(`mellomlagring/${behandlingsReferanse}/${behovstype}`, () =>
    clientHentMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    })
  );

  async function lagreMellomlagring(vurdering: object) {
    const res = await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
    });

    if (isSuccess(res)) {
      mutate();
    }
  }

  async function slettMellomlagring() {
    const res = await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });

    if (isSuccess(res)) {
      mutate();
    }
  }

  return {
    lagreMellomlagring,
    slettMellomlagring,
    mellomlagring: isSuccess(response) ? response.data.mellomlagretVurdering : mellomlagring,
  };
}
