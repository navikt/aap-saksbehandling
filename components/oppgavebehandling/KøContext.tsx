'use client';

import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { ComboboxOption } from '@navikt/ds-react/esm/form/combobox/types';
import { SortState } from '@navikt/ds-react';
import { useSWRConfig } from 'swr';
import { byggQueryString } from 'components/oppgavebehandling/lib/query';
import { hentAlleBehandlinger } from 'components/oppgavebehandling/oppgavekø/oppgavetabell/OppgaveFetcher';
import { usePreviousValue } from 'hooks/PreviousValueHook';

export type FilterValg = {
  navn: string;
  valgteFilter: ComboboxOption[];
  alleFilter: ComboboxOption[];
};

export type Fritekstfilter = {
  navn: string;
  verdi?: string;
};

export type Kø = {
  id: string;
  navn: string;
  beskrivelse: string;
  flervalgsfilter?: FilterValg[];
  fritekstfilter?: Fritekstfilter[];
  sortering?: SortState; // hmmm
};

export const defaultKø: Kø = {
  id: 'default',
  navn: 'Standard AAP-oppgavekø',
  beskrivelse: 'Standard kø. Alle AAP oppgaver, med unntak av skjermede personer og internt ansatte.',
};

type ContextUpdate = {
  valgtKø: Kø;
  oppdaterValgtKø: (k: Kø) => void;
  oppdaterKøliste: (k: Kø[]) => void;
  køliste: Kø[];
};

export const KøContext = createContext<ContextUpdate>({
  valgtKø: defaultKø,
  oppdaterValgtKø: () => {},
  oppdaterKøliste: () => {},
  køliste: [],
});

interface Props {
  children: ReactNode;
}

const storeData = (køer: Kø[]): void => {
  if (køer.length > 0) {
    localStorage.setItem('køer', JSON.stringify(køer.filter((kø) => kø.id !== 'default')));
  } else {
    console.warn('Ingen elementer i køen. Lagrer ikke');
  }
};

const getInitialState = (): Kø[] => {
  const data = localStorage.getItem('køer');
  const result: Kø[] = data ? JSON.parse(data) : [];
  return [defaultKø, ...result];
};

export const KøProvider = ({ children }: Props) => {
  const [valgtKø, oppdaterValgtKø] = useState<Kø>(defaultKø);
  const [køliste, oppdaterKøliste] = useState<Kø[]>(getInitialState());
  const { mutate } = useSWRConfig();

  const search = byggQueryString(valgtKø);
  const nyttSoek = useCallback(() => mutate('oppgaveliste', () => hentAlleBehandlinger(search)), [mutate, search]);

  const forrigeSortering = usePreviousValue<SortState | undefined>(valgtKø.sortering);

  useEffect(() => {
    storeData(køliste);
  }, [køliste]);

  useEffect(() => {
    // gjør nytt søk automatisk når sortering endrer seg
    const gjoerNyttSoek = valgtKø.sortering || (!valgtKø.sortering && forrigeSortering);
    if (gjoerNyttSoek) {
      nyttSoek();
    }
  }, [valgtKø.sortering, nyttSoek, forrigeSortering]);

  return (
    <KøContext.Provider value={{ valgtKø, oppdaterValgtKø, køliste, oppdaterKøliste }}>{children}</KøContext.Provider>
  );
};
