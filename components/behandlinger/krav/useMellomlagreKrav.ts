import { MellomlagretVurdering, KravVurderingLøsning } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { clientLagreMellomlagring, clientSlettMellomlagring } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useCallback, useState } from 'react';

export interface KravMellomlagretData {
  endredeVedtatte: Record<string, KravVurderingLøsning>;
  endredeNye: Record<string, KravVurderingLøsning>;
  slettedeNye: string[];
  lokaleNye: Record<string, KravVurderingLøsning>;
}

const TOM_DATA: KravMellomlagretData = {
  endredeVedtatte: {},
  endredeNye: {},
  slettedeNye: [],
  lokaleNye: {},
};

export function useMellomlagreKrav(initialMellomlagretVurdering?: MellomlagretVurdering) {
  const { behandlingsreferanse } = useParamsMedType();

  const [mellomlagretVurdering, setMellomlagretVurdering] = useState<MellomlagretVurdering | undefined>(
    initialMellomlagretVurdering
  );

  const initialData: KravMellomlagretData = mellomlagretVurdering?.data
    ? (JSON.parse(mellomlagretVurdering.data) as KravMellomlagretData)
    : TOM_DATA;

  const lagre = useCallback(
    async (data: KravMellomlagretData) => {
      const res = await clientLagreMellomlagring({
        avklaringsbehovkode: Behovstype.VURDER_KRAV_KODE,
        behandlingsReferanse: behandlingsreferanse,
        data: JSON.stringify(data),
      });

      if (isSuccess(res)) {
        setMellomlagretVurdering(res.data.mellomlagretVurdering);
      }
    },
    [behandlingsreferanse]
  );

  const slett = useCallback(async () => {
    await clientSlettMellomlagring({
      behandlingsreferanse,
      behovstype: Behovstype.VURDER_KRAV_KODE,
    });
    setMellomlagretVurdering(undefined);
  }, [behandlingsreferanse]);

  return { initialData, lagre, slett, mellomlagretVurdering };
}
