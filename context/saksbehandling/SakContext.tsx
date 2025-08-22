'use client';

import React, { createContext, useMemo } from 'react';

export interface SakContextType {
  sak: Sak;
}

export const SakContext = createContext<SakContextType | null>(null);

export interface Sak {
  saksnummer: string;
  opprettetTidspunkt: string;
  ident: string;
  periode: { fom: string; tom: string };
  virkningsTidspunkt: string | null | undefined;
}

interface Props {
  sak: Sak;
  children: React.ReactNode;
}

export function SakContextProvider(props: Props) {
  const { children } = props;
  const sak = useMemo<Sak>(() => props.sak, [props.sak]);

  const context: SakContextType = {
    sak,
  };

  return <SakContext value={context}>{children}</SakContext>;
}
