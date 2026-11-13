import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import { BodyLong, Button, Dialog, HStack } from '@navikt/ds-react';
import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';
import { Alert } from 'components/alert/Alert';

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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <HStack as={'span'} gap={'space-4'} align={'center'}>
              <XMarkOctagonIcon fontSize={'1.5rem'} aria-hidden />
              <span>Er du sikker på at du vil avbryte behandlingen?</span>
            </HStack>
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyLong>Behandlingen vil avsluttes og ingen endringer vil bli lagret på saken.</BodyLong>
          {sendHendelseError && <Alert variant={'error'}>{sendHendelseError.message}</Alert>}
        </Dialog.Body>
        <Dialog.Footer>
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
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
