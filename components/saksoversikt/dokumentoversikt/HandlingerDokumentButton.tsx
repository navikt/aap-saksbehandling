'use client';

import { ActionMenu, Button } from '@navikt/ds-react';
import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import { SaksInfo } from 'lib/types/types';
import { useState } from 'react';
import { erFerdigstilt } from 'lib/utils/journalpost';
import { FeilregistrerJournalpostModal } from 'components/saksoversikt/dokumentoversikt/FeilregistrerJournalpost';
import { KnyttTilSak } from 'components/saksoversikt/dokumentoversikt/KnyttTilSak';
import { Journalpost } from 'lib/types/journalpost';

export const HandlingerDokumentButton = ({ sak, journalpost }: { sak: SaksInfo; journalpost: Journalpost }) => {
  const [knyttTilSakOpen, setKnyttTilSakOpen] = useState(false);
  const [feilregistrerOpen, setFeilregistrerOpen] = useState(false);

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button variant="tertiary-neutral" icon={<MenuElipsisVerticalIcon title="Saksmeny" />} size="small" />
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
                  <ActionMenu.Item onSelect={() => setFeilregistrerOpen(true)}>
                    Opphev feilregistrering
                  </ActionMenu.Item>
                ) : (
                  <ActionMenu.Item variant="danger" onSelect={() => setFeilregistrerOpen(true)}>
                    Feilregistrer sakstilknytning
                  </ActionMenu.Item>
                )}
              </>
            )}
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>

      <KnyttTilSak
        journalpost={journalpost}
        sak={sak}
        isOpen={knyttTilSakOpen}
        onClose={() => setKnyttTilSakOpen(false)}
      />

      <FeilregistrerJournalpostModal
        journalpost={journalpost}
        isOpen={feilregistrerOpen}
        onClose={() => setFeilregistrerOpen(false)}
      />
    </>
  );
};
