'use client';

import { BodyShort, Heading, HGrid, Label, Select, SortState } from '@navikt/ds-react';
import { useContext } from 'react';
import useSWR from 'swr';

import { DEFAULT_KØ, FilterValg, Fritekstfilter, Kø, KøContext } from 'components/oppgavebehandling/KøContext';
import { FilterDTO } from 'lib/types/oppgavebehandling';
import { fetchProxy } from 'lib/clientApi';

const hentLagredeKøer = async (): Promise<FilterDTO[] | undefined> => {
  return await fetchProxy('/api/oppgavebehandling/filter', 'GET');
};

type Params = {
  sortering?: SortState;
  fritekstfilter?: Fritekstfilter[];
  flervalgsfilter?: FilterValg[];
};

export const Køvelger = () => {
  const køContext = useContext(KøContext);
  const { data, error } = useSWR('lagrede_filter', () => hentLagredeKøer());

  const køliste: Kø[] = [DEFAULT_KØ];

  if (error) {
    console.error('Feil ved lasting av filter', error);
  }
  if (data && data.length > 0) {
    const nyeFilter: Kø[] = data.map((filter) => {
      const params: Params = filter.filter && JSON.parse(filter.filter);
      return {
        id: filter.id,
        navn: filter.tittel,
        beskrivelse: filter.beskrivelse,
        sortering: params.sortering,
        fritekstfilter: params.fritekstfilter,
        flervalgsfilter: params.flervalgsfilter,
      };
    });
    køliste.push(...nyeFilter);
  }

  const settKø = (filterTittel: string) => {
    const kø = køliste.find((kø) => kø.navn === filterTittel);
    køContext.oppdaterValgtKø(kø ?? DEFAULT_KØ);
  };

  return (
    <section>
      <Heading level={'2'} size={'medium'} spacing>
        Oppgavekø
      </Heading>
      <HGrid columns="1fr 2fr" gap={'8'}>
        <div>
          <Select
            label={'Valgt oppgavekø'}
            onChange={(event) => settKø(event.target.value)}
            value={køContext.valgtKø.navn}
          >
            {køliste.map((kø) => (
              <option key={kø.navn} value={kø.navn}>
                {kø.navn}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Beskrivelse av køen</Label>
          <BodyShort>{køContext.valgtKø.beskrivelse}</BodyShort>
        </div>
      </HGrid>
    </section>
  );
};
