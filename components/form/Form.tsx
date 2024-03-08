'use client';

import { BaseSyntheticEvent, ReactNode, useState } from 'react';
import styles from 'components/form/Form.module.css';
import { Alert, Button } from '@navikt/ds-react';
import { useParams, useRouter } from 'next/navigation';
import {
  ServerSentEventData,
  ServerSentEventStatus,
} from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { StegType } from 'lib/types/types';

interface Props {
  steg: StegType;
  onSubmit: (
    callbackSuccess: () => void,
    callbackError: () => void
  ) => (e?: BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  children: ReactNode;
}

export const Form = ({ steg, onSubmit, children }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<ServerSentEventStatus | undefined>();
  const router = useRouter();
  const params = useParams();
  // TODO: Gjøre mer generisk, kjøre som onClick på alle steg
  const listenSSE = () => {
    setStatus(undefined);
    const eventSource = new EventSource(
      `/api/behandling/hent/${params.behandlingsReferanse}/${params.aktivGruppe}/${steg}/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event: any) => {
      const eventData: ServerSentEventData = JSON.parse(event.data);
      if (eventData.status === 'DONE') {
        eventSource.close();
        if (eventData.skalBytteGruppe) {
          router.push(`/sak/${params.saksId}/${params.behandlingsReferanse}/${eventData.aktivGruppe}`);
        }
        router.refresh();
        setIsLoading(false);
      }
      if (eventData.status === 'ERROR') {
        console.log('ERROR', eventData);
        setStatus(eventData.status);
        eventSource.close();
      }
      if (eventData.status === 'POLLING') {
        setStatus(eventData.status);
        console.log('POLLING', eventData);
      }
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        setIsLoading(true);
        return onSubmit(
          () => {
            listenSSE();
          },
          () => setIsLoading(false)
        )(e);
      }}
      id={steg}
    >
      {children}
      {status === 'ERROR' && (
        <Alert variant="error">Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere. 🤷‍♀️</Alert>
      )}
      {status === 'POLLING' && (
        <Alert variant="info">Maskinen bruker litt lengre tid på å jobbe enn vanlig. Ta deg en kopp kaffe ☕️</Alert>
      )}
      <Button className={styles.button} loading={isLoading}>
        Bekreft
      </Button>
    </form>
  );
};
