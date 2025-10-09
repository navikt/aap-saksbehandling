'use client';

import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Dispatch, SetStateAction } from 'react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';

interface Props {
  visSynkroniserEnhetModal: boolean;
  setVisSynkroniserEnhetModal: Dispatch<SetStateAction<boolean>>;
}

export const SynkroniserEnhetModal = ({ visSynkroniserEnhetModal, setVisSynkroniserEnhetModal }: Props) => {
  return (
    <Modal
      open={visSynkroniserEnhetModal}
      header={{
        heading: 'Kontortilhørigheten er sjekket',
        icon: <CheckmarkCircleFillIcon color={'green'} />,
      }}
      onClose={() => {
        setVisSynkroniserEnhetModal(false);
      }}
      onBeforeClose={() => {
        setVisSynkroniserEnhetModal(false);
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <BodyShort>
          Systemet har sjekket om oppgaven fortsatt hører til det registrerte kontoret. Hvis tilhørigheten er endret, er
          den flyttet til riktig kontor.
        </BodyShort>
        <Modal.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              setVisSynkroniserEnhetModal(false);
            }}
          >
            Lukk
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
