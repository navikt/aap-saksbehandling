import { Modal, Button, BodyShort } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';

interface Props {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export const IkkeSendBrevModal = ({ isOpen, onClose, onDelete }: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Ikke send brev' }}>
      <Modal.Body>
        <BodyShort spacing>
          Denne handlingen skal kun brukes i tilfeller hvor det ikke er behov for å sende brev til bruker.
        </BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Lukk</Button>
        <Button variant="danger" icon={<TrashIcon />} onClick={onDelete}>
          Ikke send brev
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
