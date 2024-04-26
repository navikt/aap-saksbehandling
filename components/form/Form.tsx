'use client';

import { FormEvent, ReactNode } from 'react';
import styles from 'components/form/Form.module.css';
import { Alert, Button } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { ServerSentEventStatus } from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';

interface Props {
  steg: StegType;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: ServerSentEventStatus | undefined;
  children: ReactNode;
  visBekreftKnapp?: boolean;
}

export const Form = ({ steg, onSubmit, status, isLoading, children, visBekreftKnapp = true }: Props) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} id={steg}>
      {children}
      {status === 'ERROR' && (
        <Alert variant="error">Det tok for lang tid å hente neste steg fra baksystemet. Kom tilbake senere. 🤷‍♀️</Alert>
      )}
      {status === 'POLLING' && (
        <Alert variant="info">Maskinen bruker litt lengre tid på å jobbe enn vanlig. Ta deg en kopp kaffe ☕️</Alert>
      )}
      {visBekreftKnapp && (
        <Button className={styles.button} loading={isLoading}>
          Bekreft
        </Button>
      )}
    </form>
  );
};
