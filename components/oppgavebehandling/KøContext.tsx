'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { ComboboxOption } from '@navikt/ds-react/esm/form/combobox/types';

export type FilterValg = {
  navn: string;
  valgteFilter: ComboboxOption[];
  alleFilter: ComboboxOption[];
};

export type Kø = {
  id: string;
  navn: string;
  beskrivelse: string;
  filter?: FilterValg[];
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

  useEffect(() => {
    storeData(køliste);
  }, [køliste]);

  return (
    <KøContext.Provider value={{ valgtKø, oppdaterValgtKø, køliste, oppdaterKøliste }}>{children}</KøContext.Provider>
  );
};
