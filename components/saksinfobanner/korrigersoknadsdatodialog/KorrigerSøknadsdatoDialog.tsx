import { Button, Dialog } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { KorrigerSøknadsdatoV0 } from 'lib/types/types';
import { useSendHendelseOgVentPåProsessering } from 'hooks/saksbehandling/SendHendelseOgVentPåProsessering';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

const FORM_ID = 'korriger-soknadsdato-dialog-form';

interface Props {
  saksnummer: string;
  isOpen: boolean;
  onClose: () => void;
}

export const KorrigerSKnadsdatoDialog = ({ saksnummer, isOpen, onClose }: Props) => {
  const { isLoading, sendHendelseOgVentPåProsessering, sendHendelseError } = useSendHendelseOgVentPåProsessering();

  const { form, formFields } = useConfigForm<{ begrunnelse: string }>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor skal søknadsdatoen korrigeres?',
      rules: { required: 'Du må gi en begrunnelse' },
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    sendHendelseOgVentPåProsessering(
      saksnummer,
      {
        saksnummer: saksnummer,
        referanse: {
          type: 'MANUELL_OPPRETTELSE',
          verdi: crypto.randomUUID(),
        },
        type: 'KORRIGER_SØKNADSDATO',
        kanal: 'DIGITAL',
        mottattTidspunkt: new Date().toISOString(),
        melding: {
          meldingType: 'KorrigerSøknadsdatoV0',
          begrunnelse: data.begrunnelse,
        } satisfies KorrigerSøknadsdatoV0,
      },
      onClose
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size={'medium'}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Opprett vurdering av korriger søknadsdato § 22-13 femte ledd</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <form id={FORM_ID} onSubmit={handleSubmit}>
            <FormField form={form} formField={formFields.begrunnelse} />
            {sendHendelseError && (
              <Alert variant={'error'} size={'small'}>
                {sendHendelseError.message}
              </Alert>
            )}
          </form>
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
