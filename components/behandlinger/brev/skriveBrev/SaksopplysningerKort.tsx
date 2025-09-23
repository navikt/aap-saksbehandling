'use client';

import { ExpansionCard, Label } from '@navikt/ds-react';
import styles from './SaksopplysningerKort.module.css';
import { ReactNode } from 'react';

interface Props {
  tittel: string;
}

interface PropsWithBegrunnelse extends Props {
  begrunnelse?: string;
  children?: never;
}

interface PropsWithChildren extends Props {
  begrunnelse?: never;
  children: ReactNode;
}

export const SaksopplysningerKort = ({ tittel, begrunnelse, children }: PropsWithBegrunnelse | PropsWithChildren) => {
  return (
    <ExpansionCard size={'small'} aria-label={tittel} className={styles.saksopplysningerKort}>
      <ExpansionCard.Header className={styles.header}>
        <ExpansionCard.Title>{tittel}</ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>
        {begrunnelse && (
          <>
            <Label as="p">Vilkårsvurdering</Label>
            <textarea readOnly value={begrunnelse} cols={40} rows={10} />
          </>
        )}
        {children && children}
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
