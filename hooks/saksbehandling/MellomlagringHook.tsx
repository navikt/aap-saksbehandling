import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useState } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';

export function useMellomlagring(
  behovstype: Behovstype,
  mellomlagringErTilstede: boolean
): {
  lagreMellomlagring: (vurdering: object) => void;
  slettMellomlagring: () => void;
  mellomlagringFinnes: boolean;
} {
  const [mellomlagringFinnes, setMellomlagringFinnes] = useState(mellomlagringErTilstede);
  const behandlingsReferanse = useBehandlingsReferanse();

  async function lagreMellomlagring(vurdering: object) {
    await clientLagreMellomlagring({
      avklaringsbehovkode: behovstype,
      behandlingsReferanse: behandlingsReferanse,
      data: JSON.stringify(vurdering),
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
