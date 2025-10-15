import { Dispatch, SetStateAction } from 'react';
import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';
import styles from './OppgaveIkkeLedigModal.module.css'

interface Props {
  visOppgaveIkkeLedigModal: boolean;
  setVisOppgaveIkkeLedigModal: Dispatch<SetStateAction<boolean>>;
  saksbehandlerNavn: string | undefined | null;
  revaliderOppgaver: () => void;
}

export const OppgaveIkkeLedigModal = ({ visOppgaveIkkeLedigModal, setVisOppgaveIkkeLedigModal, saksbehandlerNavn, revaliderOppgaver }: Props) => {
  return (
    <Modal
      className={styles.modal}
      open={visOppgaveIkkeLedigModal}
      header={{
        heading: 'Oppgaven har blitt plukket av noen andre',
        icon: <PadlockLockedFillIcon  />,
      }}
      onClose={() => {
        setVisOppgaveIkkeLedigModal(false);
        revaliderOppgaver()
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
          {`Oppgaven har blitt tildelt til ${saksbehandlerNavn} og er ikke lenger ledig. Oppdater oppgavelisten for å se ledige oppgaver.`}
        </BodyShort>
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
      </Modal.Body>
    </Modal>
  );
};