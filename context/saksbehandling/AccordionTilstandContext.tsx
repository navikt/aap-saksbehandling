'use client';

import React, { createContext } from 'react';

export interface AccordionTilstandContextType {
  isOpen: boolean;
  setIsOpen: (tilstand: boolean) => void;
}

export const AccordionTilstandContext = createContext<AccordionTilstandContextType | null>(null);

interface Props {
  accordionTilstand: AccordionTilstandContextType;
  children: React.ReactNode;
}

export function AccordionTilstandProvider({ accordionTilstand, children }: Props) {
  return <AccordionTilstandContext.Provider value={accordionTilstand}>{children}</AccordionTilstandContext.Provider>;
}
