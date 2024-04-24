'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { OppgaveFetcher } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';

import styles from './Oppgavekø.module.css';

export const AktiveOppgaver = () => {
  return (
    <ExpansionCard aria-label={'Dine aktive oppgaver'} defaultOpen className={styles.oppgavekø}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>Dine aktive oppgaver</ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <OppgaveFetcher egneOppgaver={true} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
