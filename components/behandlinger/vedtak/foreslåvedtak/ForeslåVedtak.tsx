'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Behovstype } from 'lib/utils/form';
import { Button } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
}

export const ForeslåVedtak = ({ behandlingVersjon }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, resetStatus, løsBehovOgGåTilNesteSteg, isLoading } = useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <div className={styles.foreslåvedtak}>
        Trykk på neste steg for å komme videre.
        <ServerSentEventStatusAlert status={status} resetStatus={resetStatus} />
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
          Send til beslutter
        </Button>
      </div>
    </VilkårsKort>
  );
};
