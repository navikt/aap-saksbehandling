'use client';

import { FormEvent, ReactNode } from 'react';
import styles from 'components/form/Form.module.css';
import { Button } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { ServerSentEventStatusAlert } from 'components/serversenteventstatusalert/ServerSentEventStatusAlert';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';

interface Props {
  steg: StegType;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  resetStatus?: () => void;
  children: ReactNode;
  knappTekst?: string;
  visBekreftKnapp?: boolean;
}

export const Form = ({
  steg,
  onSubmit,
  status,
  resetStatus,
  isLoading,
  children,
  visBekreftKnapp = true,
  knappTekst = 'Bekreft',
}: Props) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} id={steg} autoComplete={'off'}>
      {children}
      <ServerSentEventStatusAlert status={status} resetStatus={resetStatus} />
      {visBekreftKnapp && (
        <Button className={styles.button} loading={isLoading}>
          {knappTekst}
        </Button>
      )}
    </form>
  );
};
