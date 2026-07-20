import { Dispatch, SetStateAction } from 'react';
import { Button } from '@navikt/ds-react/Button';
import { Modal } from '@navikt/ds-react/Modal';
import { BodyShort } from '@navikt/ds-react/Typography';
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
  return (
    <Modal
      open={visOppgaveIkkeLedigModal}
      header={{
        heading: 'Oppgaven er plukket av noen andre',
        icon: <PadlockLockedFillIcon />,
      }}
      onClose={() => {
        setVisOppgaveIkkeLedigModal(false);
        revaliderOppgaver();
      }}
      onBeforeClose={() => {
        setVisOppgaveIkkeLedigModal(false);
        revaliderOppgaver();
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <BodyShort>
          {`Oppgaven er hos ${saksbehandlerNavn}. Oppdater oppgavelisten for å plukke en annen oppgave.`}
        </BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type={'button'}
          onClick={async () => {
            setVisOppgaveIkkeLedigModal(false);
          }}
        >
          Oppdater oppgavelisten
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
