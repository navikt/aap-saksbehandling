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
  id?: number;
  navn: string;
  beskrivelse: string;
  flervalgsfilter?: FilterValg[];
  fritekstfilter?: Fritekstfilter[];
  sortering?: SortState; // hmmm
};

export const DEFAULT_KØ: Kø = {
  navn: 'Standard AAP-oppgavekø',
  beskrivelse: 'Standard kø. Alle AAP oppgaver, med unntak av skjermede personer og internt ansatte.',
};

type ContextUpdate = {
  valgtKø: Kø;
  oppdaterValgtKø: (k: Kø) => void;
  køliste: Kø[];
  oppdaterKøliste: (køer: Kø[]) => void;
  valgtKøId?: number;
  oppdaterValgtKøId: (valgtKøId: number | undefined) => void;
};

export const KøContext = createContext<ContextUpdate>({
  valgtKø: DEFAULT_KØ,
  oppdaterValgtKø: () => {},
  køliste: [DEFAULT_KØ],
  oppdaterKøliste: () => {},
  valgtKøId: DEFAULT_KØ.id,
  oppdaterValgtKøId: () => {},
});

interface Props {
  children: ReactNode;
}

export const KøProvider = ({ children }: Props) => {
  const [valgtKø, oppdaterValgtKø] = useState<Kø>(DEFAULT_KØ);
  const [køListe, oppdaterKøListe] = useState<Kø[]>([DEFAULT_KØ]);
  const [valgtKøId, oppdaterValgtKøId] = useState<number | undefined>();
  const { mutate } = useSWRConfig();

  const search = byggQueryString(valgtKø);
  const nyttSoek = useCallback(() => mutate('oppgaveliste', () => hentAlleBehandlinger(search)), [mutate, search]);

  const forrigeSortering = usePreviousValue<SortState | undefined>(valgtKø.sortering);
  const forrigeKøId = usePreviousValue(valgtKø.id);

  useEffect(() => {
    // gjør nytt søk automatisk når sortering endrer seg
    const valgtSorteringErEndret = valgtKø.sortering !== forrigeSortering;
    const valgtKøErEndret = valgtKø.id !== forrigeKøId && forrigeKøId;
    if (valgtSorteringErEndret || valgtKøErEndret) {
      console.log('Gjør nytt søk');
      nyttSoek();
    }
  }, [valgtKø.sortering, nyttSoek, forrigeSortering, valgtKø.id, forrigeKøId]);

  return (
    <KøContext.Provider
      value={{
        valgtKø,
        oppdaterValgtKø,
        køliste: køListe,
        oppdaterKøliste: oppdaterKøListe,
        valgtKøId,
        oppdaterValgtKøId,
      }}
    >
      {children}
    </KøContext.Provider>
  );
};
