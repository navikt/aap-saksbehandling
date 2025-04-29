'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { Behovstype } from 'lib/utils/form';
import { BodyShort, Button } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  return (
    <VilkårsKort heading="Foreslå vedtak" steg={'FORESLÅ_VEDTAK'}>
      <div className={styles.foreslåvedtak}>
        {!readOnly && <BodyShort>Trykk på neste steg for å komme videre.</BodyShort>}
        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
        {!readOnly && (
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
        )}
      </div>
    </VilkårsKort>
  );
};
