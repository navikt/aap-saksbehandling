'use client';

import { BodyShort, ExpansionCard, Label } from '@navikt/ds-react';
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
            <Label as="p">Begrunnelse</Label>
            <BodyShort>{begrunnelse}</BodyShort>
          </>
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
