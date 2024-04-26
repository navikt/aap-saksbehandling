'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BehandlingResultat } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { Behovstype } from 'lib/utils/form';
import { Button } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';

interface Props {
  behandlingsReferanse: string;
  behandlingResultat: BehandlingResultat;
}

export const ForeslåVedtak = ({ behandlingsReferanse, behandlingResultat }: Props) => {
  const { status, løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  console.log(status);

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <Vilkårsoppsummering behandlingResultat={behandlingResultat} />
      <Button
        loading={isLoading}
        onClick={async () => {
          await løsBehovOgGåTilNesteSteg({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
            },
            referanse: behandlingsReferanse,
          });
        }}
      >
        Neste steg
      </Button>
    </VilkårsKort>
  );
};
