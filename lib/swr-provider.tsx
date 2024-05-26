'use client';
import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const SWRProvider = ({ children }: Props) => {
  return <SWRConfig value={{ fetcher: (args) => fetch(args).then((res) => res.json()) }}>{children}</SWRConfig>;
};
