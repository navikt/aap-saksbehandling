import { RefObject } from 'react';
import { Button } from '@navikt/ds-react/Button';
import { Modal } from '@navikt/ds-react/Modal';
import { BodyShort } from '@navikt/ds-react/Typography';
import { TrashFillIcon } from '@navikt/aksel-icons';

interface Props {
  ref: RefObject<HTMLDialogElement | null>;
  onSlettVurdering: () => void;
}

export const SlettVurderingModal = ({ ref, onSlettVurdering }: Props) => {
  return (
    <Modal ref={ref} header={{ heading: 'Slett vurdering', icon: <TrashFillIcon /> }}>
      <Modal.Body>
        <BodyShort>Når du sletter vurderingen vil svarene dine bli borte.</BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <Button type={'button'} onClick={() => onSlettVurdering()}>
          Slett
        </Button>
        <Button type={'button'} variant={'tertiary'} onClick={() => ref.current?.close()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
