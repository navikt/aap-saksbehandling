'use client';

import { BodyLong, Button, Dialog } from '@navikt/ds-react';
import { useOverstyrTildelingHook } from 'hooks/saksbehandling/OverstyrTildelingHook';

export const OverstyrTildelingModal = () => {
  const { visOverstyrModal, setVisOverstyrModal, reservertAvNavn, bekreftOverstyring, avbrytOverstyring } =
    useOverstyrTildelingHook();

  const handleClose = () => {
    avbrytOverstyring();
    setVisOverstyrModal(false);
  };

  return (
    <Dialog
      open={visOverstyrModal}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>Er du sikker på at du vil jobbe med denne oppgaven?</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyLong>
            {reservertAvNavn
              ? `Denne oppgaven er tildelt ${reservertAvNavn}. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.`
              : 'Denne oppgaven er tildelt noen andre. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.'}
          </BodyLong>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type={'button'}
            className={'fit-content'}
            onClick={async () => {
              bekreftOverstyring();
              setVisOverstyrModal(false);
            }}
          >
            Bekreft og fortsett
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
