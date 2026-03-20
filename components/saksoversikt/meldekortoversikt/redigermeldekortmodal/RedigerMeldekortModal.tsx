import { Button, Dialog, ErrorSummary, VStack } from '@navikt/ds-react';
import { FormProvider } from 'react-hook-form';
import { Dag, Meldekort } from 'components/saksoversikt/meldekortoversikt/meldekortTypes';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { UtfyllingKalender } from 'components/saksoversikt/meldekortoversikt/utfyllingkalender/UtfyllingKalender';
import { FormErrorSummary } from 'components/formerrorsummary/FormErrorSummary';
import { hentFeilmeldingerForForm } from 'lib/utils/formerrors';

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  meldekort?: Meldekort;
}

export interface RedigerMeldekortFormFields {
  begrunnelse: string;
  årsak: string;
  meldedato: string;
  dager: Dag[];
}

export const RedigerMeldekortModal = ({ isOpen, setIsOpen, meldekort }: Props) => {
  const { form, formFields } = useConfigForm<RedigerMeldekortFormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor gjør du endring, og hva er kilden til informasjonen.',
      defaultValue: '',
      rules: { required: 'Du må skrive en begrunnelse for hvorfor du gjør endring.' },
    },
    årsak: {
      type: 'select',
      options: ['hei', 'hoy'],
      label: 'Årsak',
      defaultValue: '',
    },
    meldedato: {
      type: 'date_input',
      label: 'Meldedato',
      description: 'Meldekortet regnes som levert på denne datoen.',
      defaultValue: '',
    },
    dager: {
      type: 'fieldArray',
      defaultValue: meldekort?.dager.map((dag) => {
        return {
          dato: dag.dato,
          timerArbeidet: dag.timerArbeidet == null || dag.timerArbeidet === 0 ? '' : dag.timerArbeidet.toString(),
        };
      }),
    },
  });

  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} size={'medium'}>
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Endre meldekort for uke x - y. fra dato - til dato</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...form}>
            <form
              id={'endre-meldekort'}
              onSubmit={form.handleSubmit(() => {
                setIsOpen(false);
              })}
            >
              <VStack gap={'4'}>
                <FormField form={form} formField={formFields.begrunnelse} />
                <FormField form={form} formField={formFields.årsak} />
                <FormField form={form} formField={formFields.meldedato} />
                <UtfyllingKalender />
                <FormErrorSummary errorList={errorList} />
              </VStack>
            </form>
          </FormProvider>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Avbryt</Button>
          </Dialog.CloseTrigger>
          <Button form={'endre-meldekort'}>Bekreft</Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
