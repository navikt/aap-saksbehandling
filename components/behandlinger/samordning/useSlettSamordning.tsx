import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useRef, useState } from 'react';

export function useSlettSamordning() {
  const [slett, setSlett] = useState<(() => void) | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  return {
    slettSamordning: (erVedtatt: boolean, onSlett: () => void) => {
      if (erVedtatt) {
        setSlett(() => onSlett);
      } else {
        onSlett();
      }
    },
    slettSamordningModal: slett && (
      <Modal ref={modalRef} open onClose={() => setSlett(null)} header={{ heading: 'Slett samordningsperiode' }}>
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
              slett();
              setSlett(null);
            }}
          >
            Slett
          </Button>
          <Button type="button" variant="tertiary" onClick={() => modalRef.current?.close()}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    ),
  };
}
