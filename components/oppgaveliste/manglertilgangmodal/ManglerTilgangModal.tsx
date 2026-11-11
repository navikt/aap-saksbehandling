'use client';

import { BodyShort, Button, Dialog } from '@navikt/ds-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  revalidateFunction: () => void;
}

export const ManglerTilgangModal = ({ isModalOpen, setIsModalOpen, revalidateFunction }: Props) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Popup width="43.75rem" closeOnOutsideClick={false}>
        <Dialog.Header withClosebutton={false}>
          <Dialog.Title>Du har ikke tilgang til saken</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>
            Saken har blitt flyttet til en annen enhet og er ikke lenger tilgjengelig for deg. Oppdater oppgavelisten
            for å se hvilke saker du kan behandle.
          </BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            type={'button'}
            onClick={async () => {
              setIsModalOpen(false);
              revalidateFunction();
            }}
          >
            Oppdater oppgavelisten
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
