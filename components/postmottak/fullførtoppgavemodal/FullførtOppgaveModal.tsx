'use client';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BehandlingFlytOgTilstand } from 'lib/types/postmottakTypes';
import { isProd } from 'lib/utils/environment';

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
  const message =
    nesteBehandlingId && !isProd()
      ? 'Dokumentet er journalført og det har blitt opprettet en ny oppgave for å digitalisere dokumentet. Start digitalisering for å fullføre hele dokumenthåndteringen. '
      : 'Gå tilbake til oppgavelisten for å starte på neste oppgave.';
  return (
    <Modal
      open={isModalOpen}
      header={{
        heading: heading,
        icon: <CheckmarkCircleIcon fontSize={'inherit'} />,
      }}
      onClose={() => {
        setIsModalOpen(false);
      }}
      onBeforeClose={() => {
        setIsModalOpen(false);
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <BodyShort>{message}</BodyShort>
        <Modal.Footer>
          {nesteBehandlingId && !isProd() ? (
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
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
