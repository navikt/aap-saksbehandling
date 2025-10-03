'use client';

import { Button, Modal } from '@navikt/ds-react';
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
    <Modal
      open={valgtRad != undefined}
      header={{
        heading: 'Registrer brudd § 11-9',
      }}
      onClose={avbryt}
      onBeforeClose={() => {
        avbryt();
        return true;
      }}
      width={'medium'}
    >
      <Modal.Body>
        <Mellomlagre11_9Skjema lagre={lagre} avbryt={avbryt} valgtRad={valgtRad} />
        <Modal.Footer>
          <Button type="submit" variant="primary" className="fit-content" form={'11-9-brudd'}>
            Lagre brudd
          </Button>
          <Button type="button" variant="secondary" className="fit-content" onClick={avbryt}>
            {valgtRad?.id === '' ? 'Forkast' : 'Avbryt endringer'}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
