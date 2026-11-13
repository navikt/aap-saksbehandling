import { BodyShort, Button, Dialog, HStack } from '@navikt/ds-react';
import { TrashFillIcon } from '@navikt/aksel-icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSlettVurdering: () => void;
}

export const SlettVurderingModal = ({ isOpen, onClose, onSlettVurdering }: Props) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <HStack as={'span'} gap={'space-4'} align={'center'}>
              <TrashFillIcon fontSize={'1.5rem'} aria-hidden />
              <span>Slett vurdering</span>
            </HStack>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>Når du sletter vurderingen vil svarene dine bli borte.</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type={'button'} onClick={() => onSlettVurdering()}>
            Slett
          </Button>
          <Button type={'button'} variant={'tertiary'} onClick={onClose}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
