'use client';

import { ExpansionCard } from '@navikt/ds-react';
import { Filter } from 'components/oppgavebehandling/oppgavekø/filter/Filter';

import styles from './Oppgavekø.module.css';
import { OppgaveFetcher } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { KøContext } from 'components/oppgavebehandling/KøContext';
import { useContext } from 'react';
import { skjulPrototype } from 'lib/utils/skjulPrototype';
import useSWR from 'swr';

export const Oppgavekø = () => {
  const køContext = useContext(KøContext);
  const { data } = useSWR('oppgaveliste');
  const antallOppgaver = () => (data?.oppgaver.length ? `(${data.oppgaver.length})` : '');
  return (
    <section className={styles.oppgavekø}>
      <ExpansionCard aria-label={køContext.valgtKø.navn} defaultOpen>
        <ExpansionCard.Header>
          <ExpansionCard.Title>
            {skjulPrototype() ? 'Felles AAP Kø' : køContext.valgtKø.navn} {antallOppgaver()}
          </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Filter />
          <OppgaveFetcher />
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  );
};
