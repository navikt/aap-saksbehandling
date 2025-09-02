'use client';

import { Behovstype } from 'lib/utils/form';
import { BodyShort, Label } from '@navikt/ds-react';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';

import styles from './ForeslåVedtak.module.css';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormEvent } from 'react';
import { ForeslåVedtakGrunnlag } from 'lib/types/types';
import { ForeslåVedtakTabell } from 'components/behandlinger/vedtak/foreslåvedtak/foreslåvedtaktabell/ForeslåVedtakTabell';
import { isProd } from 'lib/utils/environment';
import { VilkRskortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårskortMedForm';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: ForeslåVedtakGrunnlag;
}

export const ForeslåVedtak = ({ behandlingVersjon, readOnly, grunnlag }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { status, løsBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORESLÅ_VEDTAK');

  return (
    <VilkRskortMedForm
      heading="Foreslå vedtak"
      steg={'FORESLÅ_VEDTAK'}
      vilkårTilhørerNavKontor={false}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
        {isProd() ? (
          <>{!readOnly && <BodyShort>Trykk på neste steg for å komme videre.</BodyShort>}</>
        ) : (
          <>
            <Label as="p" size={'medium'}>
              Vedtaket medfører følgende konsekvens for brukeren:
            </Label>
            <ForeslåVedtakTabell grunnlag={grunnlag} />
          </>
        )}

        <LøsBehovOgGåTilNesteStegStatusAlert
          status={status}
          løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        />
      </div>
    </VilkRskortMedForm>
  );
};
