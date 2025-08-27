import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import styles from './KansellerRevurderingModal.module.css';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
}

export const KansellerRevurderingModal = ({ saksnummer, isOpen, onClose, behandlingReferanse }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />,
        heading: 'Er du sikker på at du vil kansellere revurderingen?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>Når du kansellere revurderingen vil saken avsluttes og eventuelle vurderinger bli slettet.</BodyLong>
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
                  årsakerTilBehandling: ['REVURDERING_KANSELLERT'],
                } as NyÅrsakTilBehandlingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Kanseller revurdering
        </Button>
        <Button variant={'secondary'} onClick={onClose} type="button">
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
