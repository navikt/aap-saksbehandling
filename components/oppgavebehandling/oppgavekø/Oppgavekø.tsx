'use client';

import { mockOppgaver } from 'mocks/mockOppgaver';
import { Oppgave } from 'lib/types/oppgavebehandling';
import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';
import { ExpansionCard } from '@navikt/ds-react';

import styles from './Oppgavekø.module.css';

const hentOppgaver = async (): Promise<Oppgave[]> => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'localhost') {
    return mockOppgaver;
  }
  return [];
};

export const Oppgavekø = async () => {
  const oppgaver = await hentOppgaver();

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
