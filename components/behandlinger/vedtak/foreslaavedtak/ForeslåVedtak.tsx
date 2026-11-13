'use client';

import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';

import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { VilkårskortMedForm } from 'components/vilkaarskort/vilkårskortmedform/VilkårskortMedForm';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { formatDatoMedMånedsnavn } from 'lib/utils/date';
import { useFeatureFlag } from 'context/UnleashContext';
import { StansOpphørTabell } from 'components/behandlinger/vedtak/foreslaavedtak/StansOpphørTabell';
import { ForeslåVedtakTabellGammel } from 'components/behandlinger/vedtak/foreslaavedtak/foreslåvedtaktabell/ForeslåVedtakTabellGammel';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehovStatus, løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('FORESLÅ_VEDTAK');

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'FORESLÅ_VEDTAK', undefined);
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);
  const vedtaksperiodeBeslutterEnabled = useFeatureFlag('VedtaksperiodeBeslutter');

  return (
    <VilkårskortMedForm
      heading={vedtaksperiodeBeslutterEnabled ? 'Behandlingen medfører følgende rettighetsperiode' : 'Foreslå vedtak'}
      steg={'FORESLÅ_VEDTAK'}
      vilkårTilhørerNavKontor={false}
      status={løsAvklaringsbehovStatus}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      isLoading={løsAvklaringsbehovIsLoading}
      onSubmit={(event) => {
        event.preventDefault();
        løsAvklaringsbehov(
          {
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
            },
            referanse: behandlingsreferanse,
          },
          () => {
            loggUmamiVarighet('STEG_FORESLÅ_VEDTAK_VARIGHET', umamiStartTidspunkt, Date.now());
          }
        );
      }}
      knappTekst={'Send til beslutter'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      {vedtaksperiodeBeslutterEnabled ? (
        <VStack gap={'space-20'}>
          {grunnlag.endretRettighetsperiode && (
            <Alert variant="info" size="small">
              Rettighetsperioden er endret:{' '}
              <BodyShort as="s">
                {formatDatoMedMånedsnavn(grunnlag.endretRettighetsperiode.fra.fom)} –{' '}
                {formatDatoMedMånedsnavn(grunnlag.endretRettighetsperiode.fra.tom)}
              </BodyShort>{' '}
              {formatDatoMedMånedsnavn(grunnlag.endretRettighetsperiode.til.fom)} –{' '}
              {formatDatoMedMånedsnavn(grunnlag.endretRettighetsperiode.til.tom)}
            </Alert>
          )}
          <ForeslåVedtakTabell grunnlag={grunnlag} />
        </VStack>
      ) : (
        <VStack gap={'space-16'}>
          <Label as="p" size={'medium'}>
            Vedtaket medfører følgende konsekvens for brukeren:
          </Label>
          <ForeslåVedtakTabellGammel grunnlag={grunnlag} />
          <StansOpphørTabell stansOpphør={grunnlag.stansOpphør} />
        </VStack>
      )}
    </VilkårskortMedForm>
  );
};
