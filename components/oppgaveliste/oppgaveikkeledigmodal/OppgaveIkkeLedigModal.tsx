import { Dispatch, SetStateAction } from 'react';
import { BodyShort, Button, Dialog } from '@navikt/ds-react';
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
      <Dialog.Popup width="43.75rem" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <PadlockLockedFillIcon aria-hidden /> Oppgaven er plukket av noen andre
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
