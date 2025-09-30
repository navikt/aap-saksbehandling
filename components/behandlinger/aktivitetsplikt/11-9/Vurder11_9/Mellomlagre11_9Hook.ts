import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { MellomlagretVurdering } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype } from 'lib/utils/form';
import { useState } from 'react';
import { BruddRad } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { isEqual, omit } from 'lodash';
import { BruddStatus } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/utils';

interface MellomlagretData {
  mellomlagredeVurderinger: Vurdering11_9[];
  vurderingerSendtTilBeslutterSomSkalSlettes: string[];
}

export function useMellomlagre11_9(
  tidligereVurderinger: Vurdering11_9[],
  vurderingerSendtTilBeslutter: Vurdering11_9[],
  initialMellomlagretVurdering?: MellomlagretVurdering
) {
  const { mellomlagretVurdering, lagreMellomlagring, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.VURDER_BRUDD_11_9_KODE,
    initialMellomlagretVurdering
  );

  const { mellomlagredeVurderinger, vurderingerSendtTilBeslutterSomSkalSlettes }: MellomlagretData =
    mellomlagretVurdering?.data
      ? JSON.parse(mellomlagretVurdering.data)
      : { mellomlagredeVurderinger: [], vurderingerSendtTilBeslutterSomSkalSlettes: [] };

  const [valgtRad, velgRad] = useState<BruddRad>();

  const lagre = (vurdering: Vurdering11_9) => {
    velgRad(undefined);
    const duplikat = [...tidligereVurderinger, ...vurderingerSendtTilBeslutter].find((eksisterende) =>
      isEqual(omit(eksisterende, 'id'), omit(vurdering, 'id'))
    );
    if (duplikat) {
      return;
    }
    lagreMellomlagring({
      mellomlagredeVurderinger: [...mellomlagredeVurderinger.filter((v) => v.dato !== vurdering.dato), vurdering],
      vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes,
    });
  };

  const fjernRad = (rad: BruddRad) => {
    if (rad.status === BruddStatus.SENDT_TIL_BESLUTTER) {
      lagreMellomlagring({
        mellomlagredeVurderinger: mellomlagredeVurderinger,
        vurderingerSendtTilBeslutterSomSkalSlettes: [...vurderingerSendtTilBeslutterSomSkalSlettes, rad.id],
      });
    } else {
      lagreMellomlagring({
        mellomlagredeVurderinger: mellomlagredeVurderinger.filter((v) => v.dato !== rad.dato),
        vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes,
      });
    }
  };

  const angreFjerning = (id: string) => {
    lagreMellomlagring({
      mellomlagredeVurderinger: mellomlagredeVurderinger,
      vurderingerSendtTilBeslutterSomSkalSlettes: vurderingerSendtTilBeslutterSomSkalSlettes.filter(
        (slettetId) => slettetId !== id
      ),
    });
  };

  return {
    valgtRad,
    velgRad,
    lagre,
    fjernRad,
    angreFjerning,
    mellomlagredeVurderinger,
    vurderingerSendtTilBeslutterSomSkalSlettes,
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
