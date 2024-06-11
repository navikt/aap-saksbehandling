import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useRef } from 'react';
import { fetchProxy } from 'lib/clientApi';

interface Props {
  kønavn: string;
  køId: number;
}

export const SlettFilter = ({ kønavn, køId }: Props) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const slettKø = async () => {
    const res = await fetchProxy(`/api/oppgavebehandling/filter/${køId}/`, 'DELETE');
    if (!res) {
      console.error('Klarte ikke å slette kø');
    } else {
      modalRef.current?.close();
    }
  };

  return (
    <>
      <Button variant={'danger'} onClick={() => modalRef.current?.showModal()}>
        Slett kø
      </Button>
      <Modal ref={modalRef} header={{ heading: 'Slett kø?' }}>
        <Modal.Body>
          <BodyShort spacing>
            Vil du slette køen <b>{kønavn}</b>? Dette kan ikke angres.
          </BodyShort>
        </Modal.Body>
        <Modal.Footer>
          <Button type={'button'} variant={'danger'} onClick={() => slettKø()}>
            Ja, slett køen!
          </Button>
          <Button type={'button'} variant={'secondary'} onClick={() => modalRef.current?.close()}>
            Nei, jeg vil ikke slette køen!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
