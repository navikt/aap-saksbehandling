'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { Button } from '@navikt/ds-react';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const BekreftVurderingerOppfølging = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } = useLøsBehovOgGåTilNesteSteg(
    'BEKREFT_VURDERINGER_OPPFØLGING'
  );

  return (
    <VilkårsKort heading={'Bekreft vurderinger'} steg={'BEKREFT_VURDERINGER_OPPFØLGING'}>
      {!readOnly && (
        <Button
          variant={'primary'}
          onClick={() =>
            løsBehovOgGåTilNesteSteg({
              behandlingVersjon: behandlingVersjon,
              behov: {
                behovstype: Behovstype.BEKREFT_VURDERINGER_OPPFØLGING,
              },
              referanse: behandlingsReferanse,
            })
          }
          loading={isLoading}
        >
          Bekreft vurderinger og send videre
        </Button>
      )}

      <LøsBehovOgGåTilNesteStegStatusAlert
        status={status}
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      />
    </VilkårsKort>
  );
};
