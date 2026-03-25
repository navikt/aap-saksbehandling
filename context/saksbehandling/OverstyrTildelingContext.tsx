'use client';

import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

export interface OverstyrTildelingContextType {
  visOverstyrModal: boolean;
  setVisOverstyrModal: Dispatch<SetStateAction<boolean>>;
  callback: () => void;
  setCallback: Dispatch<SetStateAction<() => void>>;
  reservertAvNavn: string | null;
  setReservertAvNavn: Dispatch<SetStateAction<string | null>>;
}

export const OverstyrTildelingContext = createContext<OverstyrTildelingContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function OverstyrTildelingContextProvider(props: Props) {
  const { children } = props;
  const [visOverstyrModal, setVisOverstyrModal] = useState<boolean>(false);
  const [callback, setCallback] = useState<() => void>(() => {});
  const [reservertAvNavn, setReservertAvNavn] = useState<string | null>(null);

  const context: OverstyrTildelingContextType = {
    visOverstyrModal: visOverstyrModal,
    setVisOverstyrModal: setVisOverstyrModal,
    callback,
    setCallback,
    reservertAvNavn,
    setReservertAvNavn
  };

  return <OverstyrTildelingContext.Provider value={context}>{children}</OverstyrTildelingContext.Provider>;
}
