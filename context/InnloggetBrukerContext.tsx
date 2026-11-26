'use client';

import React, { createContext } from 'react';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';

export const InnloggetBrukerContext = createContext<BrukerInformasjon | null>(null);

interface Props {
  bruker: BrukerInformasjon;
  children: React.ReactNode;
}

export function InnloggetBrukerContextProvider(props: Props) {
  const { children } = props;
  return <InnloggetBrukerContext.Provider value={props.bruker}>{children}</InnloggetBrukerContext.Provider>;
}
