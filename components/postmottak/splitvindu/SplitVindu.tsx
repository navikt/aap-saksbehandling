'use client';

import { HGrid } from '@navikt/ds-react';
import { ReactNode, useState } from 'react';
import styles from './SplitVindu.module.css';
import { Dokumentvisning } from 'components/postmottak/dokumentvisning/Dokumentvisning';
import { Dokument } from 'lib/types/postmottakTypes';

interface Props {
  children: ReactNode;
  journalpostId: number;
  dokumenter: Dokument[];
}
export const SplitVindu = ({ children, journalpostId, dokumenter }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <HGrid padding={'4'} columns={isExpanded ? '1fr 2fr' : '1fr 1fr'} gap={'4'} className={styles.splitVindu}>
      {children}

      <Dokumentvisning
        isExpanded={isExpanded}
        setIsExpandedAction={setIsExpanded}
        journalpostId={journalpostId}
        dokumenter={dokumenter}
      />
    </HGrid>
  );
};
