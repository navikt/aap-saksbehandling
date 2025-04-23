import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { v4 as uuid } from 'uuid';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ManuellRevurderingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/SendHendelseOgVentPåProsessering';

import styles from './TrekkSøknadModal.module.css';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TrekkSøknadModal = ({ saksnummer, isOpen, onClose }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />,
        heading: 'Er du sikker på at du vil trekke søknaden?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>Når du trekker søknaden vil saken avsluttes og eventuelle vurderinger bli slettet.</BodyLong>
        {sendHendelseError && (
          <Alert variant={'error'} size={'small'}>
            {sendHendelseError.message}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          type={'button'}
          className={'fit-content'}
          onClick={async () => {
            sendHendelseOgVentPåProsessering(
              saksnummer,
              {
                saksnummer: saksnummer,
                referanse: {
                  type: 'REVURDERING_ID',
                  verdi: uuid(),
                },
                type: 'MANUELL_REVURDERING',
                kanal: 'DIGITAL',
                mottattTidspunkt: new Date().toISOString(),
                melding: {
                  meldingType: 'ManuellRevurderingV0',
                  årsakerTilBehandling: ['SØKNAD_TRUKKET'],
                  beskrivelse: 'Trekk søknad',
                } as ManuellRevurderingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Trekk søknad
        </Button>
        <Button variant={'secondary'} onClick={onClose} type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
