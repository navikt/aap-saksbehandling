'use client';

import React, { createContext } from 'react';

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

export function SakContextProvider({ sak, children }: Props) {
  return <SakContext value={{ sak }}>{children}</SakContext>;
}
