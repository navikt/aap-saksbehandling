import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import styles from './TrekkSøknadModal.module.css';
import { v4 as uuid } from 'uuid';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
  navIdent?: string | null;
}

export const TrekkSøknadModal = ({ saksnummer, isOpen, onClose, behandlingReferanse, navIdent }: Props) => {
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
                  type: 'SAKSBEHANDLER_KELVIN_REFERANSE',
                  verdi: uuid(),
                },
                type: 'NY_ÅRSAK_TIL_BEHANDLING',
                kanal: 'DIGITAL',
                mottattTidspunkt: new Date().toISOString(),
                melding: {
                  meldingType: 'NyÅrsakTilBehandlingV0',
                  årsakerTilBehandling: ['SØKNAD_TRUKKET'],
                  behandlingReferanse: behandlingReferanse,
                  reserverTilBruker: navIdent ?? null,
                } satisfies NyÅrsakTilBehandlingV0,
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
