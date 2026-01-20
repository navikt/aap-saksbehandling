'use client';

import React, { createContext } from 'react';

export interface AccordionTilstandContextType {
  isOpen: boolean | undefined;
  setIsOpen: (tilstand: boolean | undefined) => void;
}

export const AccordionTilstandContext = createContext<AccordionTilstandContextType | null>(null);

interface Props {
  isOpen: boolean | undefined;
  setIsOpen: (tilstand: boolean | undefined) => void;
  children: React.ReactNode;
}

export function AccordionTilstandProvider({ setIsOpen, isOpen, children }: Props) {
  return (
    <AccordionTilstandContext.Provider value={{ isOpen, setIsOpen }}>{children}</AccordionTilstandContext.Provider>
  );
}
