import { Modal, Button, BodyShort } from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';

interface Props {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export const SlettBrevModal = ({ isOpen, onClose, onDelete }: Props) => {
  return (
    <Modal open={isOpen} onClose={onClose} header={{ heading: 'Slett brev' }}>
      <Modal.Body>
        <BodyShort spacing>
          Denne handlingen vil permanent slette brevet fra behandlingen. Skal kun brukes i tilfeller hvor det ikke er
          behov for å sende brev til bruker.
        </BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Lukk</Button>
        <Button variant="danger" icon={<TrashIcon />} onSelect={onDelete}>
          Slett brev
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
