'use client';

import { ReactNode } from 'react';
import styles from './Form.module.css';
import { Button } from '@navikt/ds-react';
import { useParams, useRouter } from 'next/navigation';

interface Props {
  onSubmit: () => void;
  behandlingsReferanse: string;
  children: ReactNode;
}

export const Form = ({ onSubmit, children, behandlingsReferanse }: Props) => {
  const router = useRouter();
  const params = useParams();
  // TODO: Gjøre mer generisk, kjøre som onClick på alle steg
  const listenSSE = () => {
    const eventSource = new EventSource(
      `/api/behandling/hent/${behandlingsReferanse}/SYKDOM/AVKLAR_SYKDOM/nesteSteg/`,
      {
        withCredentials: true,
      }
    );
    eventSource.onmessage = (event: any) => {
      const eventData = JSON.parse(event.data);
      if (eventData.skalBytteGruppe) {
        router.push(`/sak/${params.saksId}/${params.behandlingsReferanse}/${eventData.aktivGruppe}`);
      }
      eventSource.close();
    };
    eventSource.onerror = (event: any) => {
      throw new Error('event onError', event);
    };
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        listenSSE();
      }}
    >
      {children}
      <Button>Bekreft</Button>
    </form>
  );
};
