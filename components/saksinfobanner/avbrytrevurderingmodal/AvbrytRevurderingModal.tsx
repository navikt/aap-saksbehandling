import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { v4 as uuid } from 'uuid';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
  brukerInformasjon?: { NAVident: string } | null;
}

export const AvbrytRevurderingModal = ({ saksnummer, isOpen, onClose, behandlingReferanse, brukerInformasjon }: Props) => {
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
          Når du avbryter revurderingen vil behandlingen avsluttes og ingen endringer vil bli lagret på saken.
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
                  type: 'SAKSBEHANDLER_KELVIN_REFERANSE',
                  verdi: uuid(),
                },
                type: 'NY_ÅRSAK_TIL_BEHANDLING',
                kanal: 'DIGITAL',
                mottattTidspunkt: new Date().toISOString(),
                melding: {
                  meldingType: 'NyÅrsakTilBehandlingV0',
                  årsakerTilBehandling: ['REVURDERING_AVBRUTT'],
                  behandlingReferanse: behandlingReferanse,
                  reserverTilBruker: brukerInformasjon?.NAVident,
                } satisfies NyÅrsakTilBehandlingV0,
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
