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
import { Alert, Label, VStack } from '@navikt/ds-react';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  behandlingsreferanse: string;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  harTilgangTilÅSaksbehandle: boolean;
  behandlingsversjon: number;
}

export interface ToTrinnsVurderingFormFields {
  godkjent?: JaEllerNei;
  begrunnelse?: string;
  grunner?: ToTrinnsVurderingGrunn[];
  årsakFritekst?: string;
  definisjon: AvklaringsbehovKode;
}

export const ToTrinnsvurdering = ({
  grunnlag,
  readOnly,
  erKvalitetssikring,
  initialMellomlagretVurdering,
  harTilgangTilÅSaksbehandle,
  behandlingsversjon,
}: Props) => {
  const vurderteTotrinnsvurderinger = grunnlag.vurderinger.filter(
    (vurdering) => typeof vurdering.godkjent === 'boolean'
  );

  const skalViseOppsummering = readOnly && vurderteTotrinnsvurderinger.length > 0;
  return (
    <>
      <div className={styles.toTrinnsKontroll}>
        {grunnlag.harGjortVilkårsvurderingerPåBehandling && !readOnly && (
          <Alert
            variant={'info'}
          >{`Du har jobbet på denne behandlingen tidligere og kan ikke være ${erKvalitetssikring ? 'kvalitetssikrer' : 'beslutter'}.`}</Alert>
        )}
        {skalViseOppsummering && (
          <Oppsummering vurderinger={vurderteTotrinnsvurderinger} erKvalitetssikrer={erKvalitetssikring} />
        )}
        {harTilgangTilÅSaksbehandle && !readOnly && (
          <VStack gap={'space-12'}>
            <Label>{erKvalitetssikring ? 'Kvalitetssikrer' : 'Beslutter'}</Label>
            <TotrinnsvurderingForm
              grunnlag={grunnlag}
              erKvalitetssikring={erKvalitetssikring}
              readOnly={readOnly}
              initialMellomlagretVurdering={initialMellomlagretVurdering}
              behandlingsversjon={behandlingsversjon}
            />
          </VStack>
        )}
      </div>
    </>
  );
};
