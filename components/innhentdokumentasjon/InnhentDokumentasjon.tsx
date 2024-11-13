import { Alert, Button, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';

import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { hentAlleDialogmeldingerPåSak } from 'lib/clientApi';
import useSWR from 'swr';
import { Dialogmeldinger } from 'components/innhentdokumentasjon/dialogmeldinger/Dialogmeldinger';
import { useSaksnummer } from 'hooks/BehandlingHook';
import { LegeerklæringStatus } from 'lib/types/types';

import styles from './InnhentDokumentasjon.module.css';

export const InnhentDokumentasjon = () => {
  const saksnummer = useSaksnummer();
  const { data, isLoading, error } = useSWR(`api/dokumentinnhenting/status/${saksnummer}`, () =>
    hentAlleDialogmeldingerPåSak(saksnummer)
  );
  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  return (
    <section>
      {!visSkjema && (
        <VStack gap={'4'}>
          <div>
            <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)} size={'small'}>
              Etterspør informasjon fra lege
            </Button>
          </div>
          {isLoading && (
            <div className={styles.loader}>
              <Loader title="Ser etter dialogmeldinger..." size={'xlarge'} />
            </div>
          )}
          {error && <Alert variant="error">Noe gikk galt under henting av dialogmeldinger</Alert>}
          {data && <Dialogmeldinger dialogmeldinger={data as LegeerklæringStatus[]} />}
        </VStack>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={() => oppdaterVisSkjema(false)} />}
    </section>
  );
};
