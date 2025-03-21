'use client';

import React, { createContext, useState } from 'react';

export interface IngenFlereOppgaverModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const IngenFlereOppgaverModalContext = createContext<IngenFlereOppgaverModalContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export function IngenFlereOppgaverModalContextProvider(props: Props) {
  const { children } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const context: IngenFlereOppgaverModalContextType = {
    isModalOpen,
    setIsModalOpen,
  };

  return <IngenFlereOppgaverModalContext.Provider value={context}>{children}</IngenFlereOppgaverModalContext.Provider>;
}
