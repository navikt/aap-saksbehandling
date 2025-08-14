import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useState } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagredeVurderingRequest } from 'lib/types/types';

export function useMellomlagring(
  behovstype: Behovstype,
  mellomlagringErTilstede: boolean
): {
  lagreMellomlagring: (vurdering: MellomlagredeVurderingRequest['data']) => void;
  slettMellomlagring: () => void;
  mellomlagringFinnes: boolean;
} {
  const [mellomlagringFinnes, setMellomlagringFinnes] = useState(mellomlagringErTilstede);
  const behandlingsReferanse = useBehandlingsReferanse();

  async function lagreMellomlagring(vurdering: MellomlagredeVurderingRequest['data']) {
    await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: vurdering,
    });
  }

  async function slettMellomlagring() {
    await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });
    setMellomlagringFinnes(false);
  }

  return { lagreMellomlagring, slettMellomlagring, mellomlagringFinnes };
}
