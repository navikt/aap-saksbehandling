import { fetchProxy } from 'lib/clientApi';
import { Oppgave, Oppgaver } from 'lib/types/oppgavebehandling';
import useSWR from 'swr';
import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import styles from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell.module.css';
import { Skeleton } from '@navikt/ds-react';

type Props = {
  egneOppgaver?: boolean;
};

const BRUKERNAVN = 'Eklektisk Kappe'; // må hentes

export const OppgaveFetcher = ({ egneOppgaver = false }: Props) => {
  const hentAlleBehandlinger = async () => await fetchProxy<Oppgaver>('/api/oppgavebehandling', 'GET');
  const { data, error, isLoading, isValidating, mutate } = useSWR('oppgaveliste', hentAlleBehandlinger, {
    revalidateOnFocus: false,
  });

  const finnOppgaver = (): Oppgave[] => {
    if (egneOppgaver) {
      return data?.oppgaver.filter((oppgave) => oppgave.tilordnetRessurs === BRUKERNAVN) ?? [];
    }
    return data?.oppgaver.filter((oppgave) => oppgave.tilordnetRessurs !== BRUKERNAVN) ?? [];
  };

  if (isLoading || isValidating) {
    return (
      <div className={styles.oppgavetabell}>
        <Skeleton height={80} />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div>Feil under henting av oppgaver...</div>;
  }

  return <Oppgavetabell oppgaver={finnOppgaver()} mutate={mutate} />;
};
