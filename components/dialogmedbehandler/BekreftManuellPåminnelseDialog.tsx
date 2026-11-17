'use client';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';

interface Props {
  navnPåMottaker: string;
  erÅpen: boolean;
  settErÅpen: (verdi: boolean) => void;
  bekreft: () => void;
}

export const BekreftManuellPåminnelseDialog = ({ navnPåMottaker, erÅpen, settErÅpen, bekreft }: Props) => {
  const heading = 'Send påminnelse til ' + navnPåMottaker;
  const message = 'Påminnelsen sendes til behandler med en gang. Du kan bare sende én påminnelse per dag.';

  return (
    <Dialog open={erÅpen} onOpenChange={settErÅpen}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>{heading}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>{message}</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant={'secondary'}>Avbryt</Button>
          </Dialog.CloseTrigger>
          <Button
            type={'button'}
            onClick={async () => {
              bekreft();
            }}
          >
            Send påminnelse
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
