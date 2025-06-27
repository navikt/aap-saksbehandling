'use client';

import { ExpansionCard, Label } from '@navikt/ds-react';
import styles from './SaksopplysningerKort.module.css';

export const SaksopplysningerKort = ({ tittel, begrunnelse }: { tittel: string; begrunnelse?: string }) => {
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
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
