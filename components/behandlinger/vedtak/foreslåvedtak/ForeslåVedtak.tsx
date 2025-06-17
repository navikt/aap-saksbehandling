'use client';

import { Behovstype } from 'lib/utils/form';
import { BodyShort } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  return (
    <VilkårsKortMedForm
      heading="Foreslå vedtak"
      steg={'FORESLÅ_VEDTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      onSubmit={async () => {
        løsBehovOgGåTilNesteSteg({
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.FORESLÅ_VEDTAK_KODE,
          },
          referanse: behandlingsReferanse,
        });
      }}
      knappTekst={'Send til beslutter'}
    >
      <div className={styles.foreslåvedtak}>
        {!readOnly && <BodyShort>Trykk på neste steg for å komme videre.</BodyShort>}
        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
      </div>
    </VilkårsKortMedForm>
  );
};
