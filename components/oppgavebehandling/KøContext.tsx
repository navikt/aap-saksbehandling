'use client';

import { createContext, ReactNode, useState } from 'react';
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
  navn: 'NAY Nasjonal AAP-kø',
  beskrivelse: 'Standard kø. Alle AAP oppgaver for NAY i Norge, med unntak av skjermede personer og internt ansatte.',
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

export const KøProvider = ({ children }: Props) => {
  const [valgtKø, oppdaterValgtKø] = useState<Kø>(defaultKø);
  const [køliste, oppdaterKøliste] = useState<Kø[]>([defaultKø]);
  return (
    <KøContext.Provider value={{ valgtKø, oppdaterValgtKø, køliste, oppdaterKøliste }}>{children}</KøContext.Provider>
  );
};
