import { Button, Dialog } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { NyÅrsakTilBehandlingV0 } from 'lib/types/types';
import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { FormProvider } from 'react-hook-form';

const FORM_ID = 'vurder-avslag-11-27-dialog-form';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
  behandlingReferanse: string;
  navIdent?: string | null;
}

export const Avslag11_27Dialog = ({ saksnummer, isOpen, onClose, behandlingReferanse, navIdent }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  const { form, formFields } = useConfigForm<{ begrunnelse: string }>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor bør brukeren vurderes for avslag etter § 11-27?',
      rules: { required: 'Du må gi en begrunnelse' },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
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
          beskrivelse: data.begrunnelse,
          reserverTilBruker: navIdent ?? null,
        } satisfies NyÅrsakTilBehandlingV0,
      },
      onClose
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size={'medium'}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>
            Opprett vurdering av mulig avslag fordi brukeren har annen full folketrygdytelse § 11-27
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...form}>
            <form id={FORM_ID} onSubmit={handleSubmit}>
              <FormField form={form} formField={formFields.begrunnelse} />
              {sendHendelseError && (
                <Alert variant={'error'} size={'small'}>
                  {sendHendelseError.message}
                </Alert>
              )}
            </form>
          </FormProvider>
        </Dialog.Body>
        <Dialog.Footer>
          <Button form={FORM_ID} type={'submit'} loading={isLoading}>
            Bekreft
          </Button>
          <Button type={'button'} variant={'secondary'} onClick={onClose}>
            Avbryt
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};