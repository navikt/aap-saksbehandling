'use client';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { Dispatch, SetStateAction } from 'react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';

interface Props {
  visSynkroniserEnhetModal: boolean;
  setVisSynkroniserEnhetModal: Dispatch<SetStateAction<boolean>>;
}

export const SynkroniserEnhetModal = ({ visSynkroniserEnhetModal, setVisSynkroniserEnhetModal }: Props) => {
  return (
    <Dialog open={visSynkroniserEnhetModal} onOpenChange={setVisSynkroniserEnhetModal}>
      <Dialog.Popup width="43.75rem" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <CheckmarkCircleFillIcon aria-hidden color="var(--ax-text-success-decoration)" /> Kontortilhørigheten er
            sjekket
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>
            Systemet har sjekket om oppgaven fortsatt hører til det registrerte kontoret. Hvis tilhørigheten er endret,
            er den flyttet til riktig kontor.
          </BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              setVisSynkroniserEnhetModal(false);
            }}
          >
            Lukk
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
