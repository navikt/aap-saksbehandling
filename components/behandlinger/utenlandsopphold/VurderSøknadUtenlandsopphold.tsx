'use client';

import { BodyShort } from '@navikt/ds-react';
import { VilkårskortMedForm } from 'components/vilkaarskort/vilkårskortmedform/VilkårskortMedForm';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { Behovstype } from 'lib/utils/form';
import { SubmitEventHandler } from 'react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const VurderSøknadUtenlandsopphold = ({ behandlingVersjon, readOnly }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsAvklaringsbehov, løsAvklaringsbehovIsLoading, løsAvklaringsbehovStatus, løsAvklaringsbehovError } =
    useLøsAvklaringsbehov('VURDER_SØKNAD_UTENLANDSOPPHOLD');
  const { visningActions, visningModus } = useVilkårskortVisning(readOnly, 'VURDER_SØKNAD_UTENLANDSOPPHOLD', undefined);

  const handleSubmit: SubmitEventHandler = (event) => {
    event.preventDefault();
    løsAvklaringsbehov(
      {
        behandlingVersjon: behandlingVersjon,
        behov: { behovstype: Behovstype.VURDER_SØKNAD_UTENLANDSOPPHOLD_KODE },
        referanse: behandlingsreferanse,
      },
      () => visningActions.onBekreftClick()
    );
  };

  return (
    <VilkårskortMedForm
      heading="Søknad om å beholde AAP under opphold i utlandet"
      steg="VURDER_SØKNAD_UTENLANDSOPPHOLD"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      visningModus={visningModus}
      visningActions={visningActions}
    >
      <BodyShort>Bekreft når søknaden er vurdert. Behandlingen går da videre til vedtaksbrev.</BodyShort>
    </VilkårskortMedForm>
  );
};
