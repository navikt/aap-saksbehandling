'use client';

import { JaEllerNei } from 'lib/utils/form';
import { Oppsummering } from 'components/totrinnsvurdering/oppsummering/Oppsummering';
import {
  AvklaringsbehovKode,
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  MellomlagretVurdering,
  ToTrinnsVurderingGrunn,
} from 'lib/types/types';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { Label, VStack } from '@navikt/ds-react';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  behandlingsreferanse: string;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface ToTrinnsVurderingFormFields {
  godkjent?: JaEllerNei;
  begrunnelse?: string;
  grunner?: ToTrinnsVurderingGrunn[];
  årsakFritekst?: string;
  definisjon: AvklaringsbehovKode;
}

export const ToTrinnsvurdering = ({ grunnlag, readOnly, erKvalitetssikring, initialMellomlagretVurdering }: Props) => {
  const vurderteTotrinnsvurderinger = grunnlag.vurderinger.filter(
    (vurdering) => typeof vurdering.godkjent === 'boolean'
  );

  return (
    <div className={styles.toTrinnsKontroll}>
      {readOnly && vurderteTotrinnsvurderinger.length > 0 && (
        <Oppsummering vurderinger={vurderteTotrinnsvurderinger} erKvalitetssikrer={erKvalitetssikring} />
      )}

      {!readOnly && (
        <VStack gap={'3'}>
          <Label>{erKvalitetssikring ? 'Kvalitetssikrer' : 'Beslutter'}</Label>
          <TotrinnsvurderingForm
            grunnlag={grunnlag}
            erKvalitetssikring={erKvalitetssikring}
            readOnly={readOnly}
            initialMellomlagretVurdering={initialMellomlagretVurdering}
          />
        </VStack>
      )}
    </div>
  );
};
