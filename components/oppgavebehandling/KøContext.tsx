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
  navn: string;
  beskrivelse: string;
  flervalgsfilter?: FilterValg[];
  fritekstfilter?: Fritekstfilter[];
  sortering?: SortState; // hmmm
};

export const defaultKø: Kø = {
  navn: 'Standard AAP-oppgavekø',
  beskrivelse: 'Standard kø. Alle AAP oppgaver, med unntak av skjermede personer og internt ansatte.',
};

type ContextUpdate = {
  valgtKø: Kø;
  oppdaterValgtKø: (k: Kø) => void;
};

export const KøContext = createContext<ContextUpdate>({
  valgtKø: defaultKø,
  oppdaterValgtKø: () => {},
});

interface Props {
  children: ReactNode;
}

export const KøProvider = ({ children }: Props) => {
  const [valgtKø, oppdaterValgtKø] = useState<Kø>(defaultKø);
  const { mutate } = useSWRConfig();

  const search = byggQueryString(valgtKø);
  const nyttSoek = useCallback(() => mutate('oppgaveliste', () => hentAlleBehandlinger(search)), [mutate, search]);

  const forrigeSortering = usePreviousValue<SortState | undefined>(valgtKø.sortering);

  useEffect(() => {
    // gjør nytt søk automatisk når sortering endrer seg
    const valgtSorteringErEndret = valgtKø.sortering !== forrigeSortering;
    if (valgtSorteringErEndret) {
      nyttSoek();
    }
  }, [valgtKø.sortering, nyttSoek, forrigeSortering]);

  return <KøContext.Provider value={{ valgtKø, oppdaterValgtKø }}>{children}</KøContext.Provider>;
};
