import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';

import { CalendarIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/SendHendelseOgVentPåProsessering';

import styles from './VurderRettighetsperiodeModal.module.css';

interface Props {
  saksnummer: string;
  behandlingReferanse: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VurderRettighetsperiodeModal = ({ saksnummer, behandlingReferanse, isOpen, onClose }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <CalendarIcon title="" fontSize="1.5rem" />,
        heading: 'Endre starttidspunkt',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>Dersom søker har rett på AAP-stønad før søknadstidspunktet kan starttidspunktet overstyres.</BodyLong>
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
                  årsakerTilBehandling: ['VURDER_RETTIGHETSPERIODE'],
                } as NyÅrsakTilBehandlingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Overstyr starttidspunkt
        </Button>
        <Button variant={'secondary'} onClick={onClose} type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
