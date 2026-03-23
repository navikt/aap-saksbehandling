import { BodyLong, Button, Modal } from '@navikt/ds-react';
import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onConfirm?: () => void;
  reservertAvNavn?: string;
}

export const OverstyrTildelingModal = ({ isOpen, onClose, isLoading, onConfirm, reservertAvNavn }: Props) => {
  return (
    <Modal
      header={{
        heading: 'Er du sikker på at du vil jobbe med denne oppgaven?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>
          {reservertAvNavn
            ? `Denne oppgaven er tildelt ${reservertAvNavn}. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.`
            : 'Denne oppgaven er tildelt noen andre. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.'}
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type={'button'}
          className={'fit-content'}
          onClick={async () => {
            onConfirm && onConfirm();
            onClose();
          }}
          loading={isLoading}
        >
          Bekreft og fortsett
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            onClose();
          }}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
