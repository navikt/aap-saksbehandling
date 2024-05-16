'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from './SideProsessKort.module.css';

interface Props {
  heading: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
}

export const SideProsessKort = ({ heading, children, icon, defaultOpen = true }: Props) => {
  return (
    <ExpansionCard aria-label={heading} className={styles.sideProsessKort} size={'small'} defaultOpen={defaultOpen}>
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          {icon && <div>{icon}</div>}
          <ExpansionCard.Title>{heading}</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>{children}</ExpansionCard.Content>
    </ExpansionCard>
  );
};
