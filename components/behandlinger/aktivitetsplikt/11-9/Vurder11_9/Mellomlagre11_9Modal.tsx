'use client';

import { Button, Dialog } from '@navikt/ds-react';
import { BruddRad } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Registrer11_9BruddTabell';
import { Vurdering11_9 } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Vurder11_9MedDataFetching';
import { Mellomlagre11_9Skjema } from 'components/behandlinger/aktivitetsplikt/11-9/Vurder11_9/Mellomlagre11_9Skjema';

interface Props {
  valgtRad?: BruddRad;
  lagre: (vurdering: Vurdering11_9) => void;
  avbryt: () => void;
}

export const Mellomlagre11_9Modal = ({ valgtRad, lagre, avbryt }: Props) => {
  return (
    <Dialog
      open={valgtRad != undefined}
      onOpenChange={(open) => {
        if (!open) avbryt();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>{valgtRad?.id ? 'Endre brudd § 11-9' : 'Registrer brudd § 11-9'}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Mellomlagre11_9Skjema lagre={lagre} avbryt={avbryt} valgtRad={valgtRad} />
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="submit" variant="primary" className="fit-content" form={'11-9-brudd'}>
            Lagre brudd
          </Button>
          <Button type="button" variant="secondary" className="fit-content" onClick={avbryt}>
            {valgtRad?.id === '' ? 'Forkast' : 'Avbryt endringer'}
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
