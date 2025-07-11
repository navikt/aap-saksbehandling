'use client';

import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import { OppgaveAlleFiltere } from '../oppgavefiltersamling/OppgaveFilterSamling';

const initFilter: OppgaveAlleFiltere = { oppgaveTyper: [] };
export const OppgaveAlleFiltereContext = createContext<OppgaveAlleFiltere>(initFilter);
export const OppgaveAlleFiltereDispatchContext = createContext<Dispatch<OppgaveAlleFiltereAction> | null>(null);
interface Props {
  children: ReactNode;
}

interface OppgaveAlleFiltereAction {
  type: 'SET_FILTERE';
  payload: Partial<OppgaveAlleFiltere>;
}

export const OppgaveAlleFiltereProvider = ({ children }: Props) => {
  const [filtere, filterDispatch] = useReducer(filterReducer, initFilter);
  return (
    <OppgaveAlleFiltereContext.Provider value={filtere}>
      <OppgaveAlleFiltereDispatchContext.Provider value={filterDispatch}>
        {children}
      </OppgaveAlleFiltereDispatchContext.Provider>
    </OppgaveAlleFiltereContext.Provider>
  );
};
function filterReducer(filtere: OppgaveAlleFiltere, action: OppgaveAlleFiltereAction) {
  switch (action.type) {
    case 'SET_FILTERE':
      return {
        ...filtere,
        ...action.payload,
      };
  }
}
