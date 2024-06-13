'use client';
import { useContext } from 'react';
import useSWR from 'swr';

import { ExpansionCard } from '@navikt/ds-react';

import { OppgaveFetcher } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { KøContext } from 'components/oppgavebehandling/KøContext';
import { FilterWrapper } from 'components/oppgavebehandling/oppgavekø/filter/FilterWrapper';

import styles from './Oppgavekø.module.css';

export const Oppgavekø = () => {
  const køContext = useContext(KøContext);
  const { data } = useSWR('oppgaveliste');
  const antallOppgaver = () => (data?.oppgaver.length ? `(${data.oppgaver.length})` : '');
  return (
    <section className={styles.oppgavekø}>
      <ExpansionCard aria-label={køContext.valgtKø.navn}>
        <ExpansionCard.Header>
          <ExpansionCard.Title>
            {køContext.valgtKø.navn} {antallOppgaver()}
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <FilterWrapper />
          <OppgaveFetcher />
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  );
};
