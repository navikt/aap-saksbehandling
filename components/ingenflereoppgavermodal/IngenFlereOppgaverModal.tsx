'use client';

import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { useIngenFlereOppgaverModal } from 'hooks/saksbehandling/IngenFlereOppgaverModalHook';

export const IngenFlereOppgaverModal = () => {
  const router = useRouter();
  const { isModalOpen, setIsModalOpen } = useIngenFlereOppgaverModal();

  return (
    <Modal
      open={isModalOpen}
      header={{
        heading: 'Du har fullført oppgaven',
        icon: <CheckmarkCircleIcon fontSize={'inherit'} />,
      }}
      onClose={() => {
        setIsModalOpen(false);
      }}
      onBeforeClose={() => {
        setIsModalOpen(false);
        return true;
      }}
    >
      <Modal.Body>
        <BodyShort spacing>Gå tilbake til oppgavelisten for å starte på neste oppgave.</BodyShort>
        <Modal.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              router.push('/oppgave');
              setIsModalOpen(false);
            }}
          >
            Gå til oppgavelisten
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
