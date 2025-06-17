'use client';

import React, { createContext, useState } from 'react';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';

export const InnloggetBrukerContext = createContext<BrukerInformasjon | null>(null);

interface Props {
  bruker: BrukerInformasjon;
  children: React.ReactNode;
}

export function InnloggetBrukerContextProvider(props: Props) {
  const { children } = props;
  const [bruker] = useState<BrukerInformasjon>(props.bruker);

  const context: BrukerInformasjon = {
    ...bruker,
  };

  return <InnloggetBrukerContext.Provider value={context}>{children}</InnloggetBrukerContext.Provider>;
}
