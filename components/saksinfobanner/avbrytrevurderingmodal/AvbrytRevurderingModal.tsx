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

export const AvbrytRevurderingModal = ({ saksnummer, isOpen, onClose, behandlingReferanse, navIdent }: Props) => {
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
            <XMarkOctagonIcon aria-hidden /> Er du sikker på at du vil avbryte revurderingen?
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyLong>
            Når du avbryter revurderingen vil behandlingen avsluttes og ingen endringer vil bli lagret på saken.
          </BodyLong>
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
                    årsakerTilBehandling: ['REVURDERING_AVBRUTT'],
                    behandlingReferanse: behandlingReferanse,
                    reserverTilBruker: navIdent ?? null,
                  } satisfies NyÅrsakTilBehandlingV0,
                },
                onClose
              );
            }}
            loading={isLoading}
          >
            Bekreft
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
