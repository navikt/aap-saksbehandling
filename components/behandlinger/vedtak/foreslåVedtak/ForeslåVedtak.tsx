'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BehandlingResultat } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { Behovstype } from 'lib/utils/form';
import { løsBehov } from 'lib/clientApi';
import { Button } from '@navikt/ds-react';
import { useNesteSteg } from 'hooks/NesteStegHook';

interface Props {
  behandlingsReferanse: string;
  behandlingResultat: BehandlingResultat;
}

export const ForeslåVedtak = ({ behandlingsReferanse, behandlingResultat }: Props) => {
  const { status, listenSSE, isLoading } = useNesteSteg('FORESLÅ_VEDTAK');

  console.log(status);

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <Vilkårsoppsummering behandlingResultat={behandlingResultat} />
      <Button
        loading={isLoading}
        onClick={async () => {
          await løsBehov({
            behandlingVersjon: 0,
            behov: {
              behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
            },
            referanse: behandlingsReferanse,
          });
          await listenSSE();
        }}
      >
        Neste steg
      </Button>
    </VilkårsKort>
  );
};
