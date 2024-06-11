import { fetchProxy } from 'lib/clientApi';
import { Oppgaver } from 'lib/types/oppgavebehandling';
import useSWR from 'swr';
import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import styles from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell.module.css';
import { Skeleton } from '@navikt/ds-react';
import { useContext } from 'react';
import { KøContext } from 'components/oppgavebehandling/KøContext';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';

const getUrl = (querystring?: string): string => {
  if (!querystring) {
    return '/api/oppgavebehandling';
  } else {
    return `/api/oppgavebehandling/?${querystring}`;
  }
};

export const hentAlleBehandlinger = async (querystring?: string): Promise<Oppgaver | undefined> => {
  return await fetchProxy<Oppgaver>(getUrl(querystring), 'GET');
};

export const OppgaveFetcher = () => {
  const køContext = useContext(KøContext);

  const search = byggQueryString(køContext.valgtKø);

  const { data, error, isLoading, isValidating } = useSWR('oppgaveliste', () => hentAlleBehandlinger(search), {
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
    return <div>Feil under henting av oppgaver...</div>;
  }

  return <Oppgavetabell oppgaver={data?.oppgaver ?? []} />;
};
