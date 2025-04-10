import { Alert, Button, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';

import { InnhentDokumentasjonSkjema } from 'components/innhentdokumentasjon/innhentdokumentasjonskjema/InnhentDokumentasjonSkjema';
import { clientHentAlleDialogmeldingerPåSak } from 'lib/clientApi';
import useSWR from 'swr';
import { Dialogmeldinger } from 'components/innhentdokumentasjon/dialogmeldinger/Dialogmeldinger';
import { useSaksnummer } from 'hooks/BehandlingHook';

import styles from './InnhentDokumentasjon.module.css';
import { RelevanteDokumenter } from 'components/innhentdokumentasjon/relevantedokumenter/RelevanteDokumenter';
import { isError } from 'lib/utils/api';
import { ApiException } from 'components/saksbehandling/apiexception/ApiException';

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
            <Button type="button" variant={'secondary'} size={'small'} onClick={() => oppdaterVisSkjema(true)}>
              Be om opplysninger fra behandler
            </Button>
          </div>
          {isLoading && (
            <div className={styles.loader}>
              <Loader title="Ser etter dialogmeldinger..." size={'small'} />
            </div>
          )}
          {error && (
            <Alert size={'small'} variant="error">
              Noe gikk galt under henting av dialogmeldinger
            </Alert>
          )}
          {dialogmeldinger && isError(dialogmeldinger) ? (
            <ApiException apiResponses={[dialogmeldinger]} />
          ) : (
            <Dialogmeldinger dialogmeldinger={dialogmeldinger?.data} />
          )}
        </VStack>
      )}
      {visSkjema && <InnhentDokumentasjonSkjema onCancel={skjulSkjema} onSuccess={skjulOgRefresh} />}
      <div className={styles.marginTop}>
        <RelevanteDokumenter />
      </div>
    </section>
  );
};
