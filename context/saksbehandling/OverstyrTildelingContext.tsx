'use client';

import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

interface OverstyrTildelingContextType {
  visOverstyrModal: boolean;
  setVisOverstyrModal: Dispatch<SetStateAction<boolean>>;
  callback: () => void;
  setCallback: Dispatch<SetStateAction<() => void>>;
  reservertAvNavn: string | null;
  setReservertAvNavn: Dispatch<SetStateAction<string | null>>;
  // Nye states
  bekreftTildeling: () => void;
  setBekreftTildeling: Dispatch<SetStateAction<() => void>>;
  avbrytTildeling: () => void;
  setAvbrytTildeling: Dispatch<SetStateAction<() => void>>;
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
  // Nye states
  const [bekreftTildeling, setBekreftTildeling] = useState<() => void>(() => {});
  const [avbrytTildeling, setAvbrytTildeling] = useState<() => void>(() => {});

  const context: OverstyrTildelingContextType = {
    visOverstyrModal: visOverstyrModal,
    setVisOverstyrModal: setVisOverstyrModal,
    callback,
    setCallback,
    reservertAvNavn,
    setReservertAvNavn,
    // Nye states
    bekreftTildeling,
    setBekreftTildeling,
    avbrytTildeling,
    setAvbrytTildeling,
  };

  return <OverstyrTildelingContext.Provider value={context}>{children}</OverstyrTildelingContext.Provider>;
}
