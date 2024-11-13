'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from './VilkårsKort.module.css';
import { StegType } from 'lib/types/types';

interface Props {
  heading: string;
  steg: StegType;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  vilkårTilhørerNavKontor?: boolean;
}

export const VilkårsKortForUvisstEnhet = ({ heading, steg, children, icon, defaultOpen = true }: Props) => {
  return (
    <ExpansionCard
      aria-label={heading}
      className={styles.vilkårsKortUvisstEnhet}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
    >
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
