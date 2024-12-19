'use client';

import { FormEvent, ReactNode } from 'react';
import styles from 'components/form/Form.module.css';
import { Button } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { ServerSentEventStatus } from 'app/api/behandling/hent/[referanse]/[gruppe]/[steg]/nesteSteg/route';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';

interface Props {
  steg: StegType;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: ServerSentEventStatus | undefined;
  children: ReactNode;
  knappTekst?: string;
  visBekreftKnapp?: boolean;
}

export const Form = ({
  steg,
  onSubmit,
  status,
  isLoading,
  children,
  visBekreftKnapp = true,
  knappTekst = 'Bekreft',
}: Props) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} id={steg}>
      {children}
      <ServerSentEventStatusAlert status={status} />
      {visBekreftKnapp && (
        <Button className={styles.button} loading={isLoading}>
          {knappTekst}
        </Button>
      )}
    </form>
  );
};
