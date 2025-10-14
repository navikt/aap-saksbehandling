'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
interface TildelOppgaverContext {
  oppgaveIder: number[];
  visModal: boolean;
  setVisModal: Dispatch<SetStateAction<boolean>>;
  setOppgaveIder: Dispatch<SetStateAction<number[]>>;
}
const TildelOppgaverContext = createContext<TildelOppgaverContext | null>(null);
interface Props {
  children: React.ReactNode;
}

export const TildelOppgaverProvider = ({ children }: Props) => {
  const [oppgaveIder, setOppgaveIder] = useState<number[]>([]);
  const [visModal, setVisModal] = useState<boolean>(false);

  return (
    <TildelOppgaverContext.Provider value={{ oppgaveIder, setOppgaveIder, visModal, setVisModal }}>
      {children}
    </TildelOppgaverContext.Provider>
  );
};

export function useTildelOppgaver() {
  const context = useContext(TildelOppgaverContext);
  if (context === null) {
    throw new Error('må brukes inne i en TildelOppgaverProvider');
  }
  const { oppgaveIder, setOppgaveIder, visModal, setVisModal } = context;

  return {
    oppgaveIder,
    setOppgaveIder,
    modalSkalVises: visModal,
    visModal: () => setVisModal(true),
    skjulModal: () => setVisModal(false),
  };
}
