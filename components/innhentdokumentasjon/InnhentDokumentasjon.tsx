import { Alert, Button, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';

import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { clientHentAlleDialogmeldingerPåSak } from 'lib/clientApi';
import useSWR from 'swr';
import { Dialogmeldinger } from 'components/innhentdokumentasjon/dialogmeldinger/Dialogmeldinger';
import { useSaksnummer } from 'hooks/BehandlingHook';

import styles from './InnhentDokumentasjon.module.css';

export const InnhentDokumentasjon = () => {
  const saksnummer = useSaksnummer();
  const {
    data: dialogmeldinger,
    isLoading,
    error,
    mutate,
  } = useSWR(`api/dokumentinnhenting/status/${saksnummer}`, () => clientHentAlleDialogmeldingerPåSak(saksnummer), {
    revalidateOnFocus: false,
  });

  const [visSkjema, oppdaterVisSkjema] = useState<boolean>(false);
  const skjulSkjema = () => oppdaterVisSkjema(false);
  const skjulOgRefresh = () => {
    skjulSkjema();
    mutate();
  };
  return (
    <section>
      {!visSkjema && (
        <VStack gap={'4'}>
          <div>
            <Button type="button" variant={'secondary'} onClick={() => oppdaterVisSkjema(true)}>
              Etterspør informasjon fra lege
            </Button>
          </div>
          {isLoading && (
            <div className={styles.loader}>
              <Loader title="Ser etter dialogmeldinger..." size={'xlarge'} />
            </div>
          )}
          {error && <Alert variant="error">Noe gikk galt under henting av dialogmeldinger</Alert>}
          {dialogmeldinger && <Dialogmeldinger dialogmeldinger={dialogmeldinger} />}
        </VStack>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={skjulSkjema} onSuccess={skjulOgRefresh} />}
    </section>
  );
};
