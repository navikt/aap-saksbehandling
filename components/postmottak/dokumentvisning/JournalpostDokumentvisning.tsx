'use client';

import { BodyShort, Button, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { usePostmottakJournalposter } from 'hooks/postmottak/JournalposterHook';
import { Dokument, JournalpostOversikt } from 'lib/types/postmottakTypes';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Dokumentvisning } from './Dokumentvisning';

interface Props {
  behandlingsreferanse: string;
  journalpostId: number;
  dokumenter: Dokument[];
  isExpanded: boolean;
  setIsExpandedAction: (isExpanded: boolean) => void;
}

export const JournalpostDokumentvisning = ({
  behandlingsreferanse,
  journalpostId,
  dokumenter,
  isExpanded,
  setIsExpandedAction,
}: Props) => {
  const { journalposter, finnesNesteSide, isLoading, isValidating, error, lastFlere, prøvIgjen } =
    usePostmottakJournalposter(behandlingsreferanse);
  const journalposterEtterId = new Map<string, JournalpostOversikt>();
  const behandlingensJournalpost = {
    journalpostId: String(journalpostId),
    tema: 'AAP',
    dato: '',
    dokumenter: dokumenter.map((dokument) => ({ ...dokument, kanForhaandsvises: true })),
  };
  journalposterEtterId.set(behandlingensJournalpost.journalpostId, behandlingensJournalpost);
  journalposter.forEach((journalpost) => journalposterEtterId.set(journalpost.journalpostId, journalpost));
  const alleDokumenter = [...journalposterEtterId.values()].flatMap((journalpost) =>
    journalpost.dokumenter.map((dokument) => ({
      ...dokument,
      journalpostId: journalpost.journalpostId,
      beskrivelse: `${journalpost.tittel || 'Journalpost'} ${journalpost.journalpostId}${journalpost.dato ? ` (${formaterDatoForFrontend(journalpost.dato)})` : ''}`,
    }))
  );

  return (
    <VStack gap="space-8">
      {isLoading && <BodyShort role="status">Henter journalposter …</BodyShort>}
      {error && (
        <Alert variant="error">
          Kunne ikke hente journalpostlisten.
          <Button type="button" variant="tertiary" size="small" loading={isValidating} onClick={() => prøvIgjen()}>
            Prøv igjen
          </Button>
        </Alert>
      )}
      {finnesNesteSide && !error && (
        <Button type="button" variant="tertiary" size="small" loading={isValidating} onClick={() => lastFlere()}>
          Last flere journalposter
        </Button>
      )}
      <Dokumentvisning
        journalpostId={String(journalpostId)}
        dokumenter={alleDokumenter}
        isExpanded={isExpanded}
        setIsExpandedAction={setIsExpandedAction}
      />
    </VStack>
  );
};
