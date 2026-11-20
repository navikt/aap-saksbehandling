import { BodyShort, Button, Dialog } from '@navikt/ds-react';

interface Props {
  onSlett: () => void;
  onLukk: () => void;
}

export function BekreftSlettingDialog({ onSlett, onLukk }: Props) {
  return (
    <Dialog open onOpenChange={onLukk}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Slett samordningsperiode</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>
            Merk at dette vilkåret gjelder for hele saksperioden. Ikke slett perioder som fremdeles skal være gjeldene
            tilbake i tid.
          </BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type="button"
            onClick={() => {
              onSlett();
              onLukk();
            }}
          >
            Slett
          </Button>
          <Dialog.CloseTrigger>
            <Button type="button" variant="tertiary">
              Avbryt
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
}
