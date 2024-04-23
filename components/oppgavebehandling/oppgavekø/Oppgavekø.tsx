'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';

import styles from './Oppgavekø.module.css';
import { OppgaveFetcher } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';

export const Oppgavekø = () => {
  return (
    <section className={styles.oppgavekø}>
      <ExpansionCard aria-label={'NAY nasjonal AAP-kø'} defaultOpen>
        <ExpansionCard.Header>
          <ExpansionCard.Title>NAY nasjonal AAP-kø</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Filter />
          <OppgaveFetcher />
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  );
};
