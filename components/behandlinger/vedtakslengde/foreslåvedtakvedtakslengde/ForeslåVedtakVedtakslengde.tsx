'use client';

import { Label, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { ForeslåVedtakVedtakslengdeGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';

import { StansOpphørTabell } from 'components/behandlinger/vedtak/foreslåvedtak/StansOpphørTabell';
import { ForeslåVedtakVedtakslengdeTabell } from 'components/behandlinger/vedtakslengde/foreslåvedtakvedtakslengde/ForeslåVedtakVedtakslengdeTabell';
import { VilkårskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForeslåVedtakVedtakslengdeGrunnlag;
}

export const ForeslåVedtakVedtakslengde = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehovStatus, løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('FORESLÅ_VEDTAK_VEDTAKSLENGDE');

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'FORESLÅ_VEDTAK_VEDTAKSLENGDE', undefined);
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  return (
    <VilkårskortMedForm
      heading="Oppsummert rettighet i vedtaket"
      steg={'FORESLÅ_VEDTAK_VEDTAKSLENGDE'}
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
              behovstype: Behovstype.FORESLÅ_VEDTAK_VEDTAKSLENGDE,
            },
            referanse: behandlingsreferanse,
          },
          () => {
            loggUmamiVarighet('STEG_FORESLÅ_VEDTAK_VEDTAKSLENGDE_VARIGHET', umamiStartTidspunkt, Date.now());
          }
        );
      }}
      knappTekst={'Bekreft'}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
    >
      <VStack gap={'space-16'}>
        <Label as="p" size={'medium'}>
          Vedtaket medfører følgende konsekvens for brukeren:
        </Label>
        <ForeslåVedtakVedtakslengdeTabell grunnlag={grunnlag} />
        <StansOpphørTabell stansOpphør={grunnlag.stansOpphør} />
      </VStack>
    </VilkårskortMedForm>
  );
};
