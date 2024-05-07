'use client';

import { createContext, ReactNode, useState } from 'react';
import { ComboboxOption } from '@navikt/ds-react/src/form/combobox/types';

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

const køForUnge: Kø = {
  id: '2',
  navn: 'Unge',
  beskrivelse: 'Unge brukere, 18-25 år',
  filter: [
    {
      navn: 'aapstatus',
      valgteFilter: [{ label: 'Førstegangsbehandling', value: 'foerstegangsbehandling' }],
      alleFilter: [
        { value: 'foerstegangsbehandling', label: 'Førstegangsbehandling' },
        { value: 'innvilget', label: 'Innvilget' },
        { value: 'avslaatt', label: 'Avslått' },
        { value: 'venter', label: 'På vent' },
      ],
    },
    {
      navn: 'alder',
      valgteFilter: [{ label: '25-65 år', value: 'vanlige' }],
      alleFilter: [
        { value: 'unge', label: '18-25 år' },
        { value: 'vanlige', label: '25-65 år' },
        { value: 'eldre', label: '65+ år' },
      ],
    },
  ],
};

type ContextUpdate = {
  valgtKø: Kø;
  oppdaterValgtKø: (k: Kø) => void;
  køliste: Kø[];
};

export const KøContext = createContext<ContextUpdate>({
  valgtKø: defaultKø,
  oppdaterValgtKø: () => {},
  køliste: [],
});

interface Props {
  children: ReactNode;
}

export const KøProvider = ({ children }: Props) => {
  const [valgtKø, oppdaterValgtKø] = useState<Kø>(defaultKø);
  return (
    <KøContext.Provider value={{ valgtKø, oppdaterValgtKø, køliste: [defaultKø, køForUnge] }}>
      {children}
    </KøContext.Provider>
  );
};
