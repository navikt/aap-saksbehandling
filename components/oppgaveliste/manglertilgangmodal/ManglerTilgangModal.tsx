'use client';

import { Button } from '@navikt/ds-react/Button';
import { Modal } from '@navikt/ds-react/Modal';
import { BodyShort } from '@navikt/ds-react/Typography';
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
      </Modal.Body>
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
    </Modal>
  );
};
