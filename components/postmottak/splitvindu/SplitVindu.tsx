'use client';

import { HGrid } from '@navikt/ds-react';
import { ReactNode, useState } from 'react';
import styles from './SplitVindu.module.css';
import { JournalpostDokumentvisning } from 'components/postmottak/dokumentvisning/JournalpostDokumentvisning';
import { Dokumentvisning } from 'components/postmottak/dokumentvisning/Dokumentvisning';
import { Dokument } from 'lib/types/postmottakTypes';

interface Props {
  children: ReactNode;
  behandlingsreferanse: string;
  journalpostId: number;
  dokumenter: Dokument[];
  visAlleJournalposter?: boolean;
}
export const SplitVindu = ({
  children,
  behandlingsreferanse,
  journalpostId,
  dokumenter,
  visAlleJournalposter = false,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <HGrid columns={isExpanded ? '1fr 2fr' : '1fr 1fr'} gap={'space-16'} className={styles.splitVindu}>
      {children}
      {visAlleJournalposter ? (
        <JournalpostDokumentvisning
          key={behandlingsreferanse}
          behandlingsreferanse={behandlingsreferanse}
          isExpanded={isExpanded}
          setIsExpandedAction={setIsExpanded}
          journalpostId={journalpostId}
          dokumenter={dokumenter}
        />
      ) : (
        <Dokumentvisning
          key={behandlingsreferanse}
          journalpostId={String(journalpostId)}
          dokumenter={dokumenter}
          isExpanded={isExpanded}
          setIsExpandedAction={setIsExpanded}
        />
      )}
    </HGrid>
  );
};
