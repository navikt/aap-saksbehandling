'use client';

import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { AlleFiltere } from 'components/produksjonsstyring/filtersamling/FilterSamling';

const initFilter: AlleFiltere = { behandlingstyper: [] };
export const AlleFiltereContext = createContext<AlleFiltere>(initFilter);
export const AlleFiltereDispatchContext = createContext<Dispatch<AlleFiltereAction> | null>(null);
interface Props {
  children: ReactNode;
}

interface AlleFiltereAction {
  type: 'SET_FILTERE';
  payload: Partial<AlleFiltere>;
}

export const AlleFiltereProvider = ({ children }: Props) => {
  const [filtere, filterDispatch] = useReducer(filterReducer, initFilter);
  return (
    <AlleFiltereContext.Provider value={filtere}>
      <AlleFiltereDispatchContext.Provider value={filterDispatch}>{children}</AlleFiltereDispatchContext.Provider>
    </AlleFiltereContext.Provider>
  );
};
function filterReducer(filtere: AlleFiltere, action: AlleFiltereAction) {
  switch (action.type) {
    case 'SET_FILTERE':
      return {
        ...filtere,
        ...action.payload,
      };
  }
}
