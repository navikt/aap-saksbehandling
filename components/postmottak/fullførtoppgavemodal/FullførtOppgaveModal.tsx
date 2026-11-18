'use client';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BehandlingFlytOgTilstand } from 'lib/types/postmottakTypes';

interface Props {
  nesteBehandlingId: string | undefined | null;
  typeBehandling: BehandlingFlytOgTilstand['visning']['typeBehandling'];
}

export const FullførtOppgaveModal = ({ nesteBehandlingId, typeBehandling }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  const heading =
    typeBehandling === 'Journalføring' ? 'Dokumentet er journalført' : 'Dokumentet er kategorisert og sendt.';
  // hvis nesteBehandlingId er satt vet vi at vi er i en avsluttet journalføring og at det har blitt opprettet en ny dokumenthåndtering
  const message = nesteBehandlingId
    ? 'Dokumentet er journalført og det har blitt opprettet en ny oppgave for å digitalisere dokumentet. Start digitalisering for å fullføre hele dokumenthåndteringen. '
    : 'Gå tilbake til oppgavelisten for å starte på neste oppgave.';
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <CheckmarkCircleIcon aria-hidden fontSize="inherit" /> {heading}
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>{message}</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          {nesteBehandlingId ? (
            <>
              <Button
                type={'button'}
                onClick={async () => {
                  setIsModalOpen(false);
                  router.push(`/postmottak/${nesteBehandlingId}`);
                }}
              >
                Start digitalisering av dokumentet
              </Button>
              <Button
                variant={'secondary'}
                type={'button'}
                onClick={async () => {
                  setIsModalOpen(false);
                  router.push('/oppgave');
                }}
              >
                Gå til oppgavelisten
              </Button>
            </>
          ) : (
            <Button
              type={'button'}
              onClick={async () => {
                setIsModalOpen(false);
                router.push('/oppgave');
              }}
            >
              Gå til oppgavelisten
            </Button>
          )}
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
