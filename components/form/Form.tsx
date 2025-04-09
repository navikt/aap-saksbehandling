'use client';

import { FormEvent, ReactNode } from 'react';
import styles from 'components/form/Form.module.css';
import { Button } from '@navikt/ds-react';
import { StegType } from 'lib/types/types';
import { LøsBehovOgGåTilNesteStegStatusAlert } from 'components/løsbehovoggåtilnestestegstatusalert/LøsBehovOgGåTilNesteStegStatusAlert';
import { LøsBehovOgGåTilNesteStegStatus } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { ApiException } from "lib/utils/api";

interface Props {
  steg: StegType;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  status: LøsBehovOgGåTilNesteStegStatus;
  resetStatus?: () => void;
  children: ReactNode;
  løsBehovOgGåTilNesteStegError?: ApiException;
  knappTekst?: string;
  visBekreftKnapp?: boolean;
}

export const Form = ({
  steg,
  onSubmit,
  status,
  resetStatus,
  løsBehovOgGåTilNesteStegError,
  isLoading,
  children,
  visBekreftKnapp = true,
  knappTekst = 'Bekreft',
}: Props) => {
  return (
    <form className={styles.form} onSubmit={onSubmit} id={steg} autoComplete={'off'}>
      {children}
      <LøsBehovOgGåTilNesteStegStatusAlert
        løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
        status={status}
        resetStatus={resetStatus}
      />
      {visBekreftKnapp && (
        <Button className={styles.button} loading={isLoading}>
          {knappTekst}
        </Button>
      )}
    </form>
  );
};
