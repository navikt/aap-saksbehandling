import { Dispatch, SetStateAction } from 'react';
import { BodyShort, Button, Dialog, HStack } from '@navikt/ds-react';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

interface Props {
  visOppgaveIkkeLedigModal: boolean;
  setVisOppgaveIkkeLedigModal: Dispatch<SetStateAction<boolean>>;
  saksbehandlerNavn: string | undefined | null;
  revaliderOppgaver: () => void;
}

export const OppgaveIkkeLedigModal = ({
  visOppgaveIkkeLedigModal,
  setVisOppgaveIkkeLedigModal,
  saksbehandlerNavn,
  revaliderOppgaver,
}: Props) => {
  const handleClose = () => {
    setVisOppgaveIkkeLedigModal(false);
    revaliderOppgaver();
  };

  return (
    <Dialog
      open={visOppgaveIkkeLedigModal}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <HStack as={'span'} gap={'space-4'} align={'center'}>
              <PadlockLockedFillIcon fontSize={'1.5rem'} aria-hidden />
              <span>Oppgaven er plukket av noen andre</span>
            </HStack>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>
            {`Oppgaven er hos ${saksbehandlerNavn}. Oppdater oppgavelisten for å plukke en annen oppgave.`}
          </BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type={'button'} onClick={handleClose}>
            Oppdater oppgavelisten
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
