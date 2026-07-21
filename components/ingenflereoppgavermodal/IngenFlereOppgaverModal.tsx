'use client';

import { Button } from '@navikt/ds-react/Button';
import { Modal } from '@navikt/ds-react/Modal';
import { BodyShort } from '@navikt/ds-react/Typography';
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
        <BodyShort>Gå tilbake til oppgavelisten for å starte på neste oppgave.</BodyShort>
      </Modal.Body>
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
    </Modal>
  );
};
