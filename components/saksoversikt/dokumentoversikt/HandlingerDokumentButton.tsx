'use client';

import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { Journalpost, Variantformat } from 'lib/types/journalpost';
import { SaksInfo } from 'lib/types/types';
import { erFerdigstilt } from 'lib/utils/journalpost';
import { useState } from 'react';

import { FeilregistrerJournalpostModal } from 'components/saksoversikt/dokumentoversikt/FeilregistrerJournalpost';
import { KnyttTilSakModal } from 'components/saksoversikt/dokumentoversikt/KnyttTilSakModal';

export const HandlingerDokumentButton = ({ sak, journalpost }: { sak: SaksInfo; journalpost: Journalpost }) => {
  const visOriginalDokumentVariant = useFeatureFlag('SeOriginalDokumentVariant');
  const [knyttTilSakOpen, setKnyttTilSakOpen] = useState(false);
  const [feilregistrerOpen, setFeilregistrerOpen] = useState(false);

  const originalDokument = journalpost.dokumenter.find((dokument) =>
    dokument.dokumentvarianter.find((variant) => variant.variantformat === 'ORIGINAL')
  );

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            data-color="neutral"
            variant="tertiary"
            icon={<MenuElipsisVerticalIcon title="Saksmeny" />}
            size="small"
          />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Handlinger">
            {/* TODO:
            {kanRedigeres(journalpost.journalstatus) && (
              <ActionMenu.Item onSelect={() => new Error('TODO!')}>Rediger</ActionMenu.Item>
            )}
          */}

            {journalpost.sak?.fagsakId !== sak.saksnummer && erFerdigstilt(journalpost.journalstatus) && (
              <ActionMenu.Item onSelect={() => setKnyttTilSakOpen(true)}>Knytt til sak</ActionMenu.Item>
            )}

            {erFerdigstilt(journalpost.journalstatus) && (
              <>
                <ActionMenu.Divider />

                {journalpost.journalstatus === 'FEILREGISTRERT' ? (
                  <ActionMenu.Item onSelect={() => setFeilregistrerOpen(true)}>Opphev feilregistrering</ActionMenu.Item>
                ) : (
                  <ActionMenu.Item variant="danger" onSelect={() => setFeilregistrerOpen(true)}>
                    Feilregistrer sakstilknytning
                  </ActionMenu.Item>
                )}
              </>
            )}
            {visOriginalDokumentVariant && originalDokument && (
              <ActionMenu.Item
                key={originalDokument.dokumentInfoId}
                as="a"
                href={`/saksbehandling/api/dokumenter/${journalpost.journalpostId}/${originalDokument.dokumentInfoId}/ORIGINAL`}
                target="_blank"
                rel="noreferrer noopener"
                disabled={
                  !originalDokument.dokumentvarianter.find(
                    (variant) => variant.variantformat === 'ORIGINAL' && variant.saksbehandlerHarTilgang
                  )
                }
              >
                {'Original'}
              </ActionMenu.Item>
            )}
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
      <KnyttTilSakModal
        journalpostId={journalpost.journalpostId}
        tema={journalpost.tema!}
        saksnummer={sak.saksnummer}
        brukerIdent={sak.ident}
        isOpen={knyttTilSakOpen}
        onClose={() => setKnyttTilSakOpen(false)}
        onSuccess={() => window.location.reload()}
      />
      <FeilregistrerJournalpostModal
        journalpost={journalpost}
        isOpen={feilregistrerOpen}
        onClose={() => setFeilregistrerOpen(false)}
      />
    </>
  );
};
