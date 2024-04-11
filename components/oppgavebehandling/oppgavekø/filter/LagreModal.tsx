import { BodyShort, Button, Modal, Textarea, TextField } from '@navikt/ds-react';
import { useRef } from 'react';

export const LagreModal = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button variant={'secondary'} onClick={() => modalRef.current?.showModal()}>
        Lagre som kø
      </Button>
      <Modal ref={modalRef} header={{ heading: 'Overskrift' }}>
        <Modal.Body>
          <BodyShort spacing>Søket kan lagres som en standard kø som vises for alle i din avdeling</BodyShort>
          <TextField label={'Kønavn'} />
          <Textarea label={'Beskrivelse'} />
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={() => modalRef.current?.close()}>
            Lagre kø
          </Button>
          <Button type="button" variant={'tertiary'} onClick={() => modalRef.current?.close()}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
1;
