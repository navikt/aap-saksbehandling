'use client';

import { useState } from 'react';
import { Behovstype } from 'lib/utils/form';
import { useParams } from 'next/navigation';
import { Historikk } from 'components/totrinnsvurdering/historikk/Historikk';
import { Oppsummering } from 'components/totrinnsvurdering/oppsummering/Oppsummering';
import {
  AvklaringsbehovKode,
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  ToTrinnsVurderingGrunn,
} from 'lib/types/types';
import { ToTrinnsvurderingToggleGroup } from 'components/totrinnsvurdering/totrinnsvurderingtogglegroup/ToTrinnsvurderingToggleGroup';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';

import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  behandlingsReferanse: string;
  readOnly: boolean;
}

export interface ToTrinnsVurderingFormFields {
  godkjent?: string;
  begrunnelse?: string;
  grunner?: ToTrinnsVurderingGrunn[];
  årsakFritekst?: string;
  definisjon: AvklaringsbehovKode;
}

export const ToTrinnsvurdering = ({ grunnlag, behandlingsReferanse, readOnly, erKvalitetssikring }: Props) => {
  const params = useParams();

  const [toggleGroupValue, setToggleGroupValue] = useState<string>(readOnly ? 'historikk' : 'totrinnsvurdering');

  const link = `/saksbehandling/sak/${params.saksId}/${behandlingsReferanse}`;

  const vurderteTotrinnsvurderinger = grunnlag.vurderinger.filter(
    (vurdering) => typeof vurdering.godkjent === 'boolean'
  );

  return (
    <div className={styles.toTrinnsKontroll}>
      {readOnly && (
        <Oppsummering vurderinger={vurderteTotrinnsvurderinger} link={link} erKvalitetssikrer={erKvalitetssikring} />
      )}

      <ToTrinnsvurderingToggleGroup
        activeToggle={toggleGroupValue}
        setToggleValue={setToggleGroupValue}
        erKvalitetssikring={erKvalitetssikring}
      />

      {toggleGroupValue === 'historikk' && (
        <div>
          {grunnlag.historikk.map((historikk, index) => (
            <Historikk key={index} historikk={historikk} erFørsteElementIListen={index === 0} />
          ))}
        </div>
      )}

      <div
        hidden={toggleGroupValue === 'historikk'}
        aria-hidden={toggleGroupValue === 'historikk'}
        className={toggleGroupValue === 'totrinnsvurdering' ? 'flex-column' : ''}
      >
        <TotrinnsvurderingForm
          grunnlag={grunnlag}
          link={link}
          erKvalitetssikring={erKvalitetssikring}
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
    case Behovstype.AVKLAR_BARNETILLEGG_KODE:
      return '/BARNETILLEGG/#BARNETILLEGG';
    case Behovstype.AVKLAR_SONINGSFORRHOLD:
      return '/ET_ANNET_STED';
    case Behovstype.AVKLAR_HELSEINSTITUSJON:
      return '/ET_ANNET_STED';
    case Behovstype.VURDER_KLAGE_KONTOR:
      return 'KLAGEBEHANDLING_KONTOR';
    case Behovstype.VURDER_KLAGE_NAY:
      return 'KLAGEBEHANDLING_NAY';
    default:
      return 'SYKDOM';
  }
}
