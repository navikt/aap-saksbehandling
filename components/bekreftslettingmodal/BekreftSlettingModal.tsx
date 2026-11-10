import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { ReactNode, useRef } from 'react';

interface Props {
  heading: string;
  children: ReactNode;
  onSlett: () => void;
  onLukk: () => void;
}

export function BekreftSlettingModal({ heading, children, onSlett, onLukk }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <Modal ref={modalRef} open onClose={onLukk} header={{ heading }}>
      <Modal.Body>
        <BodyShort>{children}</BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={() => {
            onSlett();
            onLukk();
          }}
        >
          Slett
        </Button>
        <Button type="button" variant="tertiary" onClick={() => modalRef.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
