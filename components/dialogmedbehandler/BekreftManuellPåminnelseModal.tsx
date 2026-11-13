'use client';

import { BodyShort, Button, Modal } from '@navikt/ds-react';

interface Props {
  navnPåMottaker: string | null | undefined;
  erModalÅpen: boolean;
  bekreft: () => void;
  avbryt: () => void;
}

export const BekreftManuellPåminnelseModal = ({ navnPåMottaker, erModalÅpen, bekreft, avbryt }: Props) => {
  const heading = 'Send påminnelse til ' + (navnPåMottaker ?? '');
  const message = 'Påminnelsen sendes til behandler med en gang. Du kan bare sende én påminnelse per dag.';

  return (
    <Modal
      open={erModalÅpen}
      header={{
        heading: heading,
      }}
      onClose={() => {
        console.log('Modal.onClose()');
        avbryt();
      }}
      onBeforeClose={() => {
        console.log('Modal.onBeforeClose()');
        avbryt();
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <BodyShort>{message}</BodyShort>
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button
            type={'button'}
            onClick={async () => {
              bekreft();
            }}
          >
            Send påminnelse
          </Button>
          <Button
            type={'button'}
            variant={'secondary'}
            onClick={async () => {
              avbryt();
            }}
          >
            Avbryt
          </Button>
        </>
      </Modal.Footer>
    </Modal>
  );
};
