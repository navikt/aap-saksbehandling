'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { BehandlingResultat } from 'lib/types/types';
import { Vilkårsoppsummering } from 'components/vilkårsoppsummering/Vilkårsoppsummering';
import { Behovstype } from 'lib/utils/form';
import { Button } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingResultat: BehandlingResultat;
  behandlingVersjon: number;
}

export const ForeslåVedtak = ({ behandlingResultat, behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <div className={styles.foreslåvedtak}>
        <Vilkårsoppsummering behandlingResultat={behandlingResultat} />
        <ServerSentEventStatusAlert status={status} />
        <Button
          className={'fit-content'}
          loading={isLoading}
          onClick={async () => {
            løsBehovOgGåTilNesteSteg({
              behandlingVersjon: behandlingVersjon,
              behov: {
                behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
              },
              referanse: behandlingsReferanse,
            });
          }}
        >
          Neste steg
        </Button>
      </div>
    </VilkårsKort>
  );
};
