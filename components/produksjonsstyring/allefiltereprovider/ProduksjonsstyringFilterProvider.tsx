'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { BehandlingsTyperOption, behandlingsTyperOptions } from 'lib/utils/behandlingstyper';

interface Filter {
  behandlingstyper: BehandlingsTyperOption[];
  oppgaveType: string[];
}

interface ProduksjonsstyringContextType {
  filter: Filter;
  setFilter: Dispatch<SetStateAction<Filter>>;
}

export const ProduksjonsstyringFilterContext = createContext<ProduksjonsstyringContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const ProduksjonsstyringFilterProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<Filter>({ behandlingstyper: behandlingsTyperOptions, oppgaveType: [] });

  const context: ProduksjonsstyringContextType = {
    filter,
    setFilter,
  };

  return (
    <ProduksjonsstyringFilterContext.Provider value={context}>{children}</ProduksjonsstyringFilterContext.Provider>
  );
};
