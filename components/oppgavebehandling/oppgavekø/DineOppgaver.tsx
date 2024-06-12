'use client';

import styles from 'components/oppgavebehandling/oppgavekø/Oppgavekø.module.css';
import { ExpansionCard, Skeleton } from '@navikt/ds-react';
import useSWR from 'swr';
import { fetchProxy } from 'lib/clientApi';
import { Oppgaver } from 'lib/types/oppgavebehandling';
import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';

const hentMineOppgaver = async () => await fetchProxy<Oppgaver>('/api/oppgavebehandling/mineoppgaver/', 'GET');
export const DineOppgaver = () => {
  const { data, error, isLoading, isValidating } = useSWR('mine_oppgaver', () => hentMineOppgaver(), {
    revalidateOnFocus: false,
  });

  if (isLoading || isValidating) {
    return (
      <div className={styles.oppgavetabell}>
        <Skeleton height={80} />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div>Feil under henting av dine oppgaver...</div>;
  }

  const antallOppgaver = data?.oppgaver?.length ?? 0;

  return (
    <section className={styles.oppgavekø}>
      <ExpansionCard aria-label={'Dine aktive oppgaver'} defaultOpen>
        <ExpansionCard.Header>
          <ExpansionCard.Title>Dine aktive oppgaver ({antallOppgaver})</ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <Oppgavetabell oppgaver={data?.oppgaver ?? []} sorterbar={false} />
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  );
};
