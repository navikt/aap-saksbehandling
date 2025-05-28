'use client'

import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  revalidateFunction: () => void;
}

export const ManglerTilgangModal = ({ isModalOpen, setIsModalOpen, revalidateFunction }: Props) => {
  return (
    <Modal
      open={isModalOpen}
      header={{
        heading: 'Du har ikke tilgang til saken',
        closeButton: false,
      }}
      onClose={() => {
        setIsModalOpen(false);
      }}
      onBeforeClose={() => {
        setIsModalOpen(false);
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <BodyShort>
          Saken har blitt flyttet til en annen enhet og er ikke lenger tilgjengelig for deg. Oppdater oppgavelisten for
          å se hvilke saker du kan behandle.
        </BodyShort>
        <Modal.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              setIsModalOpen(false);
              revalidateFunction();
            }}
          >
            Oppdater oppgavelisten
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
