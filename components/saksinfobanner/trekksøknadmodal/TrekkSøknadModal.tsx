import { BodyLong, Button, Dialog } from '@navikt/ds-react';

import { XMarkOctagonIcon } from '@navikt/aksel-icons';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import { Alert } from 'components/alert/Alert';

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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Popup width="large" closeOnOutsideClick={false}>
        <Dialog.Header>
          <Dialog.Title>
            <XMarkOctagonIcon aria-hidden /> Er du sikker på at du vil trekke søknaden?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyLong>
            Når du trekker søknaden vil saken avsluttes og alle vurderinger vil bli slettet. Saken kan ikke åpnes igjen
            etter søknaden er trukket.
          </BodyLong>
          {sendHendelseError && <Alert variant={'error'}>{sendHendelseError.message}</Alert>}
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            data-color="danger"
            type={'button'}
            className={'fit-content'}
            variant={'primary'}
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
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
