import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { v4 as uuid } from 'uuid';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { ManuellRevurderingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AvbrytRevurderingModal = ({ saksnummer, isOpen, onClose }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />,
        heading: 'Er du sikker på at du vil avbryte revurderingen?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>
          Når du avbryter revurderingen vil behandlingen avsluttes og ingen endringer vil blir lagret på saken.
        </BodyLong>
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
                  årsakerTilBehandling: ['REVURDERING_AVBRUTT'],
                  beskrivelse: 'Revurdering avbrutt',
                } satisfies ManuellRevurderingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Bekreft
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
