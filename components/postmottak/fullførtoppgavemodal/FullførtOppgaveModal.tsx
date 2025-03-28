'use client';

import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  successMessage: string;
}

export const FullførtOppgaveModal = ({ successMessage }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();
  return (
    <Modal
      open={isModalOpen}
      header={{
        heading: successMessage,
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
        <BodyShort>Gå tilbake til oppgavelisten for å starte på neste oppgave.</BodyShort>
        <Modal.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              setIsModalOpen(false);
              router.push('/oppgave');
            }}
          >
            Gå til oppgavelisten
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
