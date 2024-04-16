'use client';

import { ExpansionCard } from '@navikt/ds-react';

import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';

import { Oppgave } from 'lib/types/oppgavebehandling';
import styles from './Oppgavekø.module.css';

interface Props {
  oppgaver: Oppgave[];
}

export const Oppgavekø = ({ oppgaver }: Props) => {
  return (
    <section className={styles.oppgavekø}>
      <ExpansionCard aria-label={'NAY nasjonal AAP-kø'} defaultOpen>
        <ExpansionCard.Header>
          <ExpansionCard.Title>NAY nasjonal AAP-kø</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Filter />
          <Oppgavetabell oppgaver={oppgaver} />
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  );
};
