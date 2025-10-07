'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { ReactNode } from 'react';
import styles from 'components/vilkårskort/Vilkårskort.module.css';
import { StegType } from 'lib/types/types';

interface Props {
  heading: string;
  steg: StegType;
  children: ReactNode;
  defaultOpen?: boolean;
  aktivMarkering?: boolean;
}

export const VilkårsKort = ({ heading, steg, children, defaultOpen = true, aktivMarkering = false }: Props) => {
  const classNameBasertPåEnhet = aktivMarkering === true ? styles.vilkårsKortNAV : styles.vilkårsKort;
  return (
    <ExpansionCard
      aria-label={heading}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
      className={classNameBasertPåEnhet}
    >
      <ExpansionCard.Header className={styles.header}>
        <div className={styles.title}>
          <ExpansionCard.Title size={'small'}>{heading}</ExpansionCard.Title>
        </div>
      </ExpansionCard.Header>
      <ExpansionCard.Content className={styles.content}>{children}</ExpansionCard.Content>
    </ExpansionCard>
  );
};
