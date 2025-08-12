import { Behovstype } from 'lib/utils/form';
import { clientOppdaterMellomlagring, clientOpprettMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { useState } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';

export function useMellomlagring(
  behovstype: Behovstype,
  mellomlagringErTilstede: boolean
): {
  oppdaterMellomlagring: (vurdering: Object) => void;
  opprettMellomlagring: (vurdering: Object) => void;
  slettMellomlagring: () => void;
  mellomlagringFinnes: boolean;
} {
  const [mellomlagringFinnes, setMellomlagringFinnes] = useState(mellomlagringErTilstede);
  const behandlingsReferanse = useBehandlingsReferanse();
  const { NAVident } = useInnloggetBruker();

  async function oppdaterMellomlagring(vurdering: Object) {
    await clientOppdaterMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
      vurdering: vurdering,
      vurdertAv: NAVident,
    });
  }

  async function slettMellomlagring() {
    await clientSlettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
    });
    setMellomlagringFinnes(false);
  }

  async function opprettMellomlagring(vurdering: Object) {
    await clientOpprettMellomlagring({
      behandlingsreferanse: behandlingsReferanse,
      behovstype: behovstype,
      vurdering: vurdering,
      vurdertAv: NAVident,
    });

    setMellomlagringFinnes(true);
  }

  return { oppdaterMellomlagring, slettMellomlagring, opprettMellomlagring, mellomlagringFinnes };
}
