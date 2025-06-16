'use client';

import { useContext } from 'react';
import { InnloggetBrukerContext } from 'context/InnloggetBrukerContext';

export function useInnloggetBruker() {
  const brukerContext = useContext(InnloggetBrukerContext);

  if (!brukerContext) {
    throw new Error('useInnloggetBruker må brukes et sted.');
  }

  return brukerContext;
}
