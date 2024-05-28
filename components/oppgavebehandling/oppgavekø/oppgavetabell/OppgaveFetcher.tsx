import { fetchProxy } from 'lib/clientApi';
import { Oppgaver } from 'lib/types/oppgavebehandling';
import useSWR from 'swr';
import { Oppgavetabell } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell';
import styles from 'components/oppgavebehandling/oppgavekø/oppgavetabell/Oppgavetabell.module.css';
import { Skeleton } from '@navikt/ds-react';
import { useContext } from 'react';
import { FilterValg, KøContext } from 'components/oppgavebehandling/KøContext';

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

export const byggQueryString = (filter: FilterValg[] | undefined) => {
  const querystring = filter
    ?.map((filterValg) => {
      const filternavn = filterValg.navn;
      return filterValg.valgteFilter.map((vf) => vf.value).map((u) => `${filternavn}=${u}`);
    })
    .flat()
    .join('&');

  const search = new URLSearchParams();
  if (querystring && querystring?.length > 0) {
    search.append('filtrering', querystring);
  }
  return search.toString();
};

export const OppgaveFetcher = () => {
  const køContext = useContext(KøContext);
  const valgtKøFilter = køContext.valgtKø.filter;

  const soek = byggQueryString(valgtKøFilter);

  const { data, error, isLoading, isValidating, mutate } = useSWR('oppgaveliste', () => hentAlleBehandlinger(soek), {
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

  return <Oppgavetabell oppgaver={data?.oppgaver ?? []} mutate={mutate} />;
};
