import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/SendHendelseOgVentPåProsessering';

import styles from './TrekkKlageModal.module.css';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
}

export const TrekkKlageModal = ({ saksnummer, behandlingReferanse, isOpen, onClose }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />,
        heading: 'Er du sikker på at du vil trekke klagen?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>Når du trekker klagen vil klagen avsluttes og eventuelle vurderinger bli slettet.</BodyLong>
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
                  type: 'BEHANDLING_REFERANSE',
                  verdi: behandlingReferanse,
                },
                type: 'NY_ÅRSAK_TIL_BEHANDLING',
                kanal: 'DIGITAL',
                mottattTidspunkt: new Date().toISOString(),
                melding: {
                  meldingType: 'NyÅrsakTilBehandlingV0',
                  årsakerTilBehandling: ['KLAGE_TRUKKET'],
                } as NyÅrsakTilBehandlingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Trekk klage
        </Button>
        <Button variant={'secondary'} onClick={onClose} type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
