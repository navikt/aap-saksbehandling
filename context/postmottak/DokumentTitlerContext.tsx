'use client';

import React, { createContext, useContext, useState } from 'react';

interface DokumentTitlerContextValue {
  titler: Record<string, string>;
  setTittel: (dokumentInfoId: string, tittel: string) => void;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}

const DokumentTitlerContext = createContext<DokumentTitlerContextValue | null>(null);

interface Props {
  children: React.ReactNode;
  dokumenter: { dokumentInfoId: string; tittel?: string | null }[];
}

export function DokumentTitlerContextProvider({ children, dokumenter }: Props) {
  const [titler, setTitler] = useState<Record<string, string>>(
    Object.fromEntries(dokumenter.map((d) => [d.dokumentInfoId, d.tittel ?? '']))
  );
  const [readOnly, setReadOnly] = useState(false);

  const setTittel = (dokumentInfoId: string, tittel: string) => {
    setTitler((prev) => (prev[dokumentInfoId] === tittel ? prev : { ...prev, [dokumentInfoId]: tittel }));
  };

  return (
    <DokumentTitlerContext.Provider value={{ titler, setTittel, readOnly, setReadOnly }}>
      {children}
    </DokumentTitlerContext.Provider>
  );
}

export function useDokumentTitler(): DokumentTitlerContextValue {
  const ctx = useContext(DokumentTitlerContext);
  if (!ctx) throw new Error('useDokumentTitler kan kun brukes i DokumentTitlerContextProvider');
  return ctx;
}
