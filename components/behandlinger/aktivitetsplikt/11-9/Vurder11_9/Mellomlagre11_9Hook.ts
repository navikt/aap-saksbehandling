import { MellomlagretVurdering } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useState } from 'react';
import { BruddRad } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { BruddStatus } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';
import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';

interface MellomlagretData {
  mellomlagredeVurderinger: Vurdering11_9[];
}

export function useMellomlagre11_9(
  vurderingerSendtTilBeslutter: Vurdering11_9[],
  initialMellomlagretVurdering?: MellomlagretVurdering
) {
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.VURDER_BRUDD_11_9_KODE,
    initialMellomlagretVurdering
  );

  const { mellomlagredeVurderinger }: MellomlagretData = mellomlagretVurdering?.data
    ? JSON.parse(mellomlagretVurdering.data)
    : { mellomlagredeVurderinger: vurderingerSendtTilBeslutter };

  const [valgtRad, velgRad] = useState<BruddRad>();

  const mellomlagreVurdering = (vurdering: Vurdering11_9) => {
    velgRad(undefined);
    lagreMellomlagring({
      mellomlagredeVurderinger: [...mellomlagredeVurderinger.filter((v) => v.dato !== vurdering.dato), vurdering],
    });
  };

  const fjernRad = (rad: BruddRad) => {
    lagreMellomlagring({
      mellomlagredeVurderinger: mellomlagredeVurderinger.filter((v) => v.dato !== rad.dato),
    });
  };

  return {
    valgtRad,
    velgRad,
    mellomlagreVurdering,
    fjernRad,
    mellomlagredeVurderinger,
    nullstillMellomlagretVurdering,
  };
}

export const defaultRad: BruddRad = {
  id: '',
  dato: '',
  brudd: undefined,
  grunn: '',
  status: BruddStatus.NY,
  begrunnelse: '',
};
