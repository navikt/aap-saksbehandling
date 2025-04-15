'use client';

import React, { createContext, useState } from 'react';

export interface SakContextType {
  sak: Sak;
}

export const SakContext = createContext<SakContextType | null>(null);

export interface Sak {
  saksnummer: string;
  opprettetTidspunkt: string;
  ident: string;
  periode: { fom: string; tom: string };
}

interface Props {
  sak: Sak;
  children: React.ReactNode;
}

export function SakContextProvider(props: Props) {
  const { children } = props;
  const [sak] = useState<Sak>(props.sak);

  const context: SakContextType = {
    sak,
  };

  return <SakContext.Provider value={context}>{children}</SakContext.Provider>;
}
