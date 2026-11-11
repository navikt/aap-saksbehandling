'use client';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { CheckmarkCircleIcon } from '@navikt/aksel-icons';
import { useIngenFlereOppgaverModal } from 'hooks/saksbehandling/IngenFlereOppgaverModalHook';

export const IngenFlereOppgaverModal = () => {
  const router = useRouter();
  const { isModalOpen, setIsModalOpen } = useIngenFlereOppgaverModal();

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Popup closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <CheckmarkCircleIcon aria-hidden fontSize="inherit" /> Du har fullført oppgaven
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>Gå tilbake til oppgavelisten for å starte på neste oppgave.</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              router.push('/oppgave');
              setIsModalOpen(false);
            }}
          >
            Gå til oppgavelisten
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
