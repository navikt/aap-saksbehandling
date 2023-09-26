'use client';

import { ReactNode } from 'react';
import styles from './Form.module.css';
import { Button } from '@navikt/ds-react';

interface Props {
  onSubmit: () => void; // TODO: Bedre type
  children: ReactNode;
}

export const Form = ({ onSubmit, children }: Props) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
      <Button>Lagre og gå til neste steg</Button>
    </form>
  );
};
