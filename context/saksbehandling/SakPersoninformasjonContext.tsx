'use client';

import React, { createContext } from 'react';
import { SakPersoninfo } from 'lib/types/types';

export interface SakContextType {
  personInformasjon: SakPersoninfo;
}

export const SakPersoninformasjonContext = createContext<SakContextType | null>(null);

interface Props {
  SakPersonInfo: SakPersoninfo;
  children: React.ReactNode;
}

export function SakPersoninformasjonContextProvider({ SakPersonInfo, children }: Props) {
  return (
    <SakPersoninformasjonContext value={{ personInformasjon: SakPersonInfo }}>{children}</SakPersoninformasjonContext>
  );
}
