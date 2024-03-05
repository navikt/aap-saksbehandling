'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { ReactNode, useEffect, useRef } from 'react';

import styles from './VilkårsKort.module.css';
import { StegType } from 'lib/types/types';

interface Props {
  heading: string;
  steg: StegType;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: ReactNode;
  erNav?: boolean;
}

export const VilkårsKort = ({ heading, steg, children, icon, defaultOpen = true, erNav = false }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    cardRef && cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const classNameBasertPåEnhet = erNav ? styles.vilkårsKortNAV : styles.vilkårsKortNAY;

  return (
    <ExpansionCard
      aria-label={heading}
      className={classNameBasertPåEnhet}
      size={'small'}
      defaultOpen={defaultOpen}
      id={steg}
      ref={cardRef}
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
