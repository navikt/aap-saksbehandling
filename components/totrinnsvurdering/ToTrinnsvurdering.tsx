'use client';

import { FatteVedtakGrunnlag } from 'lib/types/types';

import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { useState } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useParams } from 'next/navigation';
import { Historikk } from 'components/totrinnsvurdering/historikk/Historikk';
import { ToTrinnsvurderingToggleGroup } from 'components/totrinnsvurdering/totrinnsvurderingtogglegroup/ToTrinnsvurderingToggleGroup';
import { Oppsummering } from 'components/totrinnsvurdering/oppsummering/Oppsummering';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';

interface Props {
  fatteVedtakGrunnlag: FatteVedtakGrunnlag;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export interface ToTrinnsVurderingFormFields {
  godkjent?: string;
  begrunnelse?: string;
  grunn?: string[];
  harBlittRedigert: boolean;
  definisjon: string;
}

export interface ToTrinnsvurderingError {
  definisjon: string;
  felt: keyof ToTrinnsVurderingFormFields;
  message: string;
}

export const ToTrinnsvurdering = ({ fatteVedtakGrunnlag, behandlingsReferanse, readOnly }: Props) => {
  const params = useParams();

  const [toggleGroupValue, setToggleGroupValue] = useState<string>(readOnly ? 'historikk' : 'totrinnsvurdering');

  const link = `/sak/${params.saksId}/${behandlingsReferanse}`;

  const vurderteTotrinnsvurderinger = fatteVedtakGrunnlag.vurderinger.filter(
    (vurdering) => vurdering.godkjent !== undefined && vurdering.begrunnelse !== undefined
  );

  return (
    <div className={styles.toTrinnsKontroll}>
      {readOnly && <Oppsummering vurderinger={vurderteTotrinnsvurderinger} link={link} />}

      <ToTrinnsvurderingToggleGroup activeToggle={toggleGroupValue} setToggleValue={setToggleGroupValue} />

      {toggleGroupValue === 'historikk' && (
        <div>
          {fatteVedtakGrunnlag.historikk.map((historikk, index) => (
            <Historikk key={index} historikk={historikk} erFørsteElementIListen={index === 0} />
          ))}
        </div>
      )}

      <div
        hidden={toggleGroupValue === 'historikk'}
        aria-hidden={toggleGroupValue === 'historikk'}
        className={toggleGroupValue === 'totrinnsvurdering' ? styles.toTrinnsKontroll : ''}
      >
        <TotrinnsvurderingForm
          fatteVedtakGrunnlag={fatteVedtakGrunnlag}
          link={link}
          readOnly={readOnly}
          behandlingsReferanse={behandlingsReferanse}
        />
      </div>
    </div>
  );
};

export function behovstypeTilVilkårskortLink(behovstype: Behovstype): string {
  switch (behovstype) {
    case Behovstype.AVKLAR_SYKDOM_KODE:
      return 'SYKDOM/#AVKLAR_SYKDOM';
    case Behovstype.AVKLAR_BISTANDSBEHOV_KODE:
      return 'SYKDOM/#VURDER_BISTANDSBEHOV';
    case Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE:
      return 'GRUNNLAG/#FASTSETT_BEREGNINGSTIDSPUNKT';
    case Behovstype.FRITAK_MELDEPLIKT_KODE:
      return 'SYKDOM/#FRITAK_MELDEPLIKT';
    case Behovstype.FASTSETT_ARBEIDSEVNE_KODE:
      return 'SYKDOM/#FASTSETT_ARBEIDSEVNE';
    case Behovstype.VURDER_SYKEPENGEERSTATNING_KODE:
      return 'SYKDOM/#VURDER_SYKEPENGEERSTATNING';
    default:
      return 'SYKDOM';
  }
}
