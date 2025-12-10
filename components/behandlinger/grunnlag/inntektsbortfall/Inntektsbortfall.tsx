'use client';

import { Behovstype } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormEvent } from 'react';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { Alert } from '@navikt/ds-react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const Inntektsbortfall = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('INNTEKTSBORTFALL');

  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'INNTEKTSBORTFALL', undefined);

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading="§ 11-4 andre ledd. Krav om inntektsbortfall etter fylte 62 år"
      steg={'INNTEKTSBORTFALL'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      vurdertAutomatisk={true}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.INNTEKTSBORTFALL,
          },
          referanse: behandlingsReferanse,
        });
      }}
      mellomlagretVurdering={undefined}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => {}}
      onDeleteMellomlagringClick={undefined}
      onLagreMellomLagringClick={undefined}
    >
      <Alert variant="info">
        Brukeren er over 62 år og må vurderes for § 11-4 andre ledd. Det er ikke støttet i Kelvin enda. Saken må settes
        på vent i påvente av at funksjonaliteten er ferdig utviklet
      </Alert>
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};
