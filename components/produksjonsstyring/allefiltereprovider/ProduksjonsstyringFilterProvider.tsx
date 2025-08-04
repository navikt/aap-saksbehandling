'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { AlleFiltere } from 'components/produksjonsstyring/filtersamling/FilterSamling';
import { behandlingsTyperOptions } from 'lib/utils/behandlingstyper';

interface ProduksjonsstyringContextType {
  filter: AlleFiltere;
  setFilter: Dispatch<SetStateAction<AlleFiltere>>;
}

export const ProduksjonsstyringFilterContext = createContext<ProduksjonsstyringContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const ProduksjonsstyringFilterProvider = ({ children }: Props) => {
  const [filter, setFilter] = useState<AlleFiltere>({ behandlingstyper: behandlingsTyperOptions });

  const context: ProduksjonsstyringContextType = {
    filter,
    setFilter,
  };

  return (
    <ProduksjonsstyringFilterContext.Provider value={context}>{children}</ProduksjonsstyringFilterContext.Provider>
  );
};
