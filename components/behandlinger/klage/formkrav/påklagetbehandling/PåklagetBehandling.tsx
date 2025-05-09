'use client';

import { Behovstype } from '../../../../../lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from '../../../../../hooks/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKort } from '../../../../vilkårskort/VilkårsKort';
import { useBehandlingsReferanse } from '../../../../../hooks/BehandlingHook';
import { TypeBehandling } from '../../../../../lib/types/types';
import { Button } from '@navikt/ds-react';

interface Props {
  behandlingVersjon: number;
  erAktivtSteg: boolean;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

export const PåklagetBehandling = ({ behandlingVersjon }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('PÅKLAGET_BEHANDLING');

  // TODO: Denne skal erstattes med form for å velge behandling

  return (
    <VilkårsKort heading={'Påklaget behandling'} steg={'PÅKLAGET_BEHANDLING'} vilkårTilhørerNavKontor={false}>
      <p>Her kommer det mer</p>
      <Button
        className={'fit-content'}
        loading={isLoading}
        onClick={async () => {
          løsBehovOgGåTilNesteSteg({
            behandlingVersjon: behandlingVersjon,
            behov: {
              behovstype: Behovstype.FASTSETT_PÅKLAGET_BEHANDLING,
            },
            referanse: behandlingsreferanse,
          });
        }}
      >
        Fortsett
      </Button>
    </VilkårsKort>
  );
};
