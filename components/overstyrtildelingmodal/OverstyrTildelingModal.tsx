'use client';

import { BodyLong, Button, Modal } from '@navikt/ds-react';
import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';
import { useOverstyrTildelingHook } from 'hooks/saksbehandling/OverstyrTildelingHook';

export const OverstyrTildelingModal = () => {
  const {visOverstyrModal, setVisOverstyrModal, reservertAvNavn, callback} = useOverstyrTildelingHook();

  return (
    <Modal
      header={{
        heading: 'Er du sikker på at du vil jobbe med denne oppgaven?',
      }}
      open={visOverstyrModal}
      onClose={() => setVisOverstyrModal(false)}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>
          {reservertAvNavn
            ? `Denne oppgaven er tildelt ${reservertAvNavn}. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.`
            : 'Denne oppgaven er tildelt noen andre. Hvis du fortsetter, blir oppgaven tildelt deg i stedet.'}
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type={'button'}
          className={'fit-content'}
          onClick={async () => {
            callback();
            setVisOverstyrModal(false);
          }}
        >
          Bekreft og fortsett
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setVisOverstyrModal(false);
          }}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
