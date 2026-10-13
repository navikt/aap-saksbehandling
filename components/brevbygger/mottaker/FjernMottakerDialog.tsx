import { BodyLong, Button, Dialog } from '@navikt/ds-react';

export const FjernMottakerDialog = ({
  open,
  setOpen,
  fjernMottaker,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  fjernMottaker: () => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <Dialog.Popup id="dialog-fjern-kopimottaker">
      <Dialog.Header>
        <Dialog.Title>Fjern kopimottaker</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <BodyLong>Er du sikker på at du vil fjerne kopimottakeren?</BodyLong>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.CloseTrigger>
          <Button variant="secondary">Nei, avbryt</Button>
        </Dialog.CloseTrigger>
        <Button variant="danger" onClick={fjernMottaker}>
          Ja, fjern
        </Button>
      </Dialog.Footer>
    </Dialog.Popup>
  </Dialog>
);
