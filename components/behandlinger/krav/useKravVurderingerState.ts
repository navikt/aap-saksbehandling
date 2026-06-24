import { useState } from 'react';
import { KravGrunnlag, KravVurdering, KravVurderingLøsning } from 'lib/types/types';
import { useMellomlagreKrav } from 'components/behandlinger/krav/useMellomlagreKrav';
import { kravVurderingTilLøsning } from 'components/behandlinger/krav/kravutils';
import { MellomlagretVurdering } from 'lib/types/types';

interface Props {
  grunnlag?: KravGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export function useKravVurderingerState({ grunnlag, initialMellomlagretVurdering }: Props) {
  const { initialData, lagre, slett, mellomlagretVurdering } = useMellomlagreKrav(initialMellomlagretVurdering);

  const [endredeVedtatte, setEndredeVedtatte] = useState<Record<string, KravVurderingLøsning>>(
    initialData.endredeVedtatte
  );
  const [endredeNye, setEndredeNye] = useState<Record<string, KravVurderingLøsning>>(initialData.endredeNye);
  const [slettedeNyeReferanser, setSlettedeNyeReferanser] = useState<string[]>(initialData.slettedeNye);
  const [lokaleNyeKrav, setLokaleNyeKrav] = useState<Record<string, KravVurderingLøsning>>(initialData.lokaleNye);

  const [valgtVurdering, setValgtVurdering] = useState<{ krav: KravVurdering; erVedtatt: boolean } | undefined>();
  const [valgtLokalNyKey, setValgtLokalNyKey] = useState<string | undefined>();
  const [visLeggTilModal, setVisLeggTilModal] = useState(false);

  const mellomlagreTilstand = (oppdatering: Partial<typeof initialData>) => {
    lagre({
      endredeVedtatte,
      endredeNye,
      slettedeNye: slettedeNyeReferanser,
      lokaleNye: lokaleNyeKrav,
      ...oppdatering,
    });
  };

  const nullstill = () => {
    setEndredeVedtatte({});
    setEndredeNye({});
    setSlettedeNyeReferanser([]);
    setLokaleNyeKrav({});
  };

  // Grunnlag-krav
  const handleEndreKrav = (krav: KravVurdering, erVedtatt: boolean) => {
    setValgtVurdering({ krav, erVedtatt });
  };

  const handleLagre = (løsning: KravVurderingLøsning) => {
    if (!valgtVurdering) return;
    if (valgtVurdering.erVedtatt) {
      const oppdatert = { ...endredeVedtatte, [valgtVurdering.krav.referanse]: løsning };
      setEndredeVedtatte(oppdatert);
      mellomlagreTilstand({ endredeVedtatte: oppdatert });
    } else {
      const oppdatert = { ...endredeNye, [valgtVurdering.krav.referanse]: løsning };
      setEndredeNye(oppdatert);
      mellomlagreTilstand({ endredeNye: oppdatert });
    }
    setValgtVurdering(undefined);
  };

  const handleTilbakestill = () => {
    if (!valgtVurdering) return;
    if (valgtVurdering.erVedtatt) {
      const { [valgtVurdering.krav.referanse]: _, ...rest } = endredeVedtatte;
      setEndredeVedtatte(rest);
      mellomlagreTilstand({ endredeVedtatte: rest });
    } else {
      const { [valgtVurdering.krav.referanse]: _, ...rest } = endredeNye;
      setEndredeNye(rest);
      mellomlagreTilstand({ endredeNye: rest });
    }
    setValgtVurdering(undefined);
  };

  const handleSlettNyVurdering = (referanse: string) => {
    const oppdatertSlettede = [...slettedeNyeReferanser, referanse];
    const { [referanse]: _, ...oppdatertEndredeNye } = endredeNye;
    setSlettedeNyeReferanser(oppdatertSlettede);
    setEndredeNye(oppdatertEndredeNye);
    mellomlagreTilstand({ slettedeNye: oppdatertSlettede, endredeNye: oppdatertEndredeNye });
  };

  // Lokale krav
  const handleLeggTilNy = () => setVisLeggTilModal(true);

  const handleLagreNy = (løsning: KravVurderingLøsning) => {
    const key = valgtLokalNyKey ?? crypto.randomUUID();
    const oppdatert = { ...lokaleNyeKrav, [key]: løsning };
    setLokaleNyeKrav(oppdatert);
    mellomlagreTilstand({ lokaleNye: oppdatert });
    setVisLeggTilModal(false);
    setValgtLokalNyKey(undefined);
  };

  const handleEndreLokalNy = (key: string) => {
    setValgtLokalNyKey(key);
    setVisLeggTilModal(true);
  };

  const handleSlettLokalNy = (key: string) => {
    const { [key]: _, ...rest } = lokaleNyeKrav;
    setLokaleNyeKrav(rest);
    mellomlagreTilstand({ lokaleNye: rest });
  };

  const byggKravVurderinger = () => {
    const nyeVurderingerLøsninger = (grunnlag?.nyeVurderinger ?? [])
      .filter((v) => !slettedeNyeReferanser.includes(v.referanse))
      .map((vurdering) => endredeNye[vurdering.referanse] ?? kravVurderingTilLøsning(vurdering));

    return [...nyeVurderingerLøsninger, ...Object.values(endredeVedtatte), ...Object.values(lokaleNyeKrav)];
  };

  return {
    // Tabelldata
    endredeVedtatte,
    endredeNye,
    slettedeNyeReferanser,
    lokaleNyeKrav,

    // Modal-state
    valgtVurdering,
    valgtLokalNyKey,
    visLeggTilModal,
    lukkVurderingModal: () => setValgtVurdering(undefined),
    lukkLeggTilModal: () => {
      setVisLeggTilModal(false);
      setValgtLokalNyKey(undefined);
    },

    // Grunnlag-krav
    handleEndreKrav,
    handleLagre,
    handleTilbakestill,
    handleSlettNyVurdering,

    // Lokale krav
    handleLeggTilNy,
    handleLagreNy,
    handleEndreLokalNy,
    handleSlettLokalNy,

    // Mellomlagring + reset
    mellomlagretVurdering,
    nullstill,
    slettMellomlagring: slett,
    byggKravVurderinger,
  };
}
