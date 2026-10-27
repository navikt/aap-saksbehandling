'use client';

import { VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';

import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { VilkårskortMedForm } from 'components/vilkaarskort/vilkårskortmedform/VilkårskortMedForm';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

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

  return (
    <VilkårskortMedForm
      heading="Behandlingen medfører følgende rettighetsperiode"
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
      <VStack gap={'space-20'}>
        <ForeslåVedtakTabell grunnlag={grunnlag} />
      </VStack>
    </VilkårskortMedForm>
  );
};
