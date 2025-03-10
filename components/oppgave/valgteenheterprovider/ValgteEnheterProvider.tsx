'use client';

import { createContext, Dispatch, ReactNode, useReducer } from 'react';
type ValgteEnheter = string[];
const initValgteEnheter: ValgteEnheter = [];
export const ValgteEnheterContext = createContext<ValgteEnheter>(initValgteEnheter);
export const ValgteEnheterDispatchContext = createContext<Dispatch<ValgteEnheterAction> | null>(null);
interface Props {
  children: ReactNode;
}

interface ValgteEnheterAction {
  type: 'SET_ENHETER';
  payload: string[];
}

export const ValgteEnheterProvider = ({ children }: Props) => {
  const [filtere, filterDispatch] = useReducer(filterReducer, initValgteEnheter);
  return (
    <ValgteEnheterContext.Provider value={filtere}>
      <ValgteEnheterDispatchContext.Provider value={filterDispatch}>{children}</ValgteEnheterDispatchContext.Provider>
    </ValgteEnheterContext.Provider>
  );
};
function filterReducer(state: ValgteEnheter, action: ValgteEnheterAction) {
  switch (action.type) {
    case 'SET_ENHETER':
      return [...action.payload];
  }
}
