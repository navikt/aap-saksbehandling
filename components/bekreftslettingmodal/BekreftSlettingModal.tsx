import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useRef } from 'react';

interface Props {
  onSlett: () => void;
  onLukk: () => void;
}

export function BekreftSlettingModal({ onSlett, onLukk }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);


  return (
    <Modal ref={modalRef} open onClose={onLukk} header={{ heading: 'Slett samordningsperiode' }}>
      <Modal.Body>
        <BodyShort>
          Merk at dette vilkåret gjelder for hele saksperioden. Ikke slett perioder som fremdeles skal være gjeldene
          tilbake i tid.
        </BodyShort>
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
