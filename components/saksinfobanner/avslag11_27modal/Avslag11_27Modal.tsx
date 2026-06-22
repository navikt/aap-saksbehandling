import { Button, Modal } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';

import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';

import styles from 'components/saksinfobanner/avslag11_27modal/Avslag11_27Modal.module.css';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
  navIdent?: string | null;
}

export const Avslag11_27Modal = ({ saksnummer, isOpen, onClose, behandlingReferanse, navIdent }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  const { form, formFields } = useConfigForm<{ begrunnelse: string }>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor bør brukeren vurderes for avslag etter § 11-27?',
      rules: { required: 'Du må gi en begrunnelse' },
    },
  });

  return (
    <Modal
      header={{
        heading: 'Opprett vurdering av mulig avslag fordi brukeren har annen full folketrygdytelse § 11-27',
      }}
      open={isOpen}
      onClose={onClose}
      className={styles.modal}
    >
      <Modal.Body>
        <FormField form={form} formField={formFields.begrunnelse} />
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
                  årsakerTilBehandling: ['VURDER_AVSLAG_11_27'],
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
        <Button variant={'secondary'} onClick={onClose}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
