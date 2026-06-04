import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import styles from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal.module.css';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
  navIdent?: string | null;
}

export const AvbrytAktivitetspliktbehandlingModal = ({
  saksnummer,
  isOpen,
  onClose,
  behandlingReferanse,
  navIdent,
}: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  return (
    <Modal
      header={{
        icon: <XMarkOctagonIcon title="" fontSize="1.5rem" />,
        heading: 'Er du sikker på at du vil avbryte behandlingen?',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <BodyLong>Behandlingen vil avsluttes og ingen endringer vil bli lagret på saken.</BodyLong>
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
                  verdi: crypto.randomUUID(),
                },
                type: 'NY_ÅRSAK_TIL_BEHANDLING',
                kanal: 'DIGITAL',
                mottattTidspunkt: new Date().toISOString(),
                melding: {
                  meldingType: 'NyÅrsakTilBehandlingV0',
                  årsakerTilBehandling: ['AKTIVITETSPLIKTBEHANDLING_AVBRUTT'],
                  behandlingReferanse: behandlingReferanse,
                  reserverTilBruker: navIdent ?? null,
                } satisfies NyÅrsakTilBehandlingV0,
              },
              onClose
            );
          }}
          loading={isLoading}
        >
          Avbryt behandling
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
