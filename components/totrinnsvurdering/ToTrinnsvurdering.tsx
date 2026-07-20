'use client';

import { VStack } from '@navikt/ds-react/Stack';
import { Label } from '@navikt/ds-react/Typography';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { Markering } from 'lib/types/oppgaveTypes';
import {
  AvklaringsbehovKode,
  FatteVedtakGrunnlag,
  KvalitetssikringGrunnlag,
  MellomlagretVurdering,
  ToTrinnsVurderingGrunn,
} from 'lib/types/types';
import { JaEllerNei } from 'lib/utils/form';
import { brukerErBeslutter, brukerErKvalitetssikrer } from 'lib/utils/innloggetBruker';

import { Alert } from 'components/alert/Alert';
import styles from 'components/totrinnsvurdering/ToTrinnsvurdering.module.css';
import { Oppsummering } from 'components/totrinnsvurdering/oppsummering/Oppsummering';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';

interface Props {
  grunnlag: FatteVedtakGrunnlag | KvalitetssikringGrunnlag;
  erKvalitetssikring: boolean;
  behandlingsreferanse: string;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  harTilgangTilÅSaksbehandle: boolean;
  behandlingsversjon: number;
  hastemarkering?: Markering;
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
  hastemarkering,
}: Props) => {
  const vurderteTotrinnsvurderinger = grunnlag.vurderinger.filter(
    (vurdering) => typeof vurdering.godkjent === 'boolean'
  );

  const skalViseOppsummering = readOnly && vurderteTotrinnsvurderinger.length > 0;
  const innloggetBruker = useInnloggetBruker();

  return (
    <>
      <div className={styles.toTrinnsKontroll}>
        {grunnlag.harGjortVilkårsvurderingerPåBehandling &&
          ((erKvalitetssikring && brukerErKvalitetssikrer(innloggetBruker)) ||
            (!erKvalitetssikring && brukerErBeslutter(innloggetBruker))) &&
          !readOnly && (
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
              hastemarkering={hastemarkering}
            />
          </VStack>
        )}
      </div>
    </>
  );
};
