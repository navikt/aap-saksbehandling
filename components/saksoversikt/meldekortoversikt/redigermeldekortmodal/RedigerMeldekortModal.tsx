import { BodyLong, Button, Dialog, VStack } from '@navikt/ds-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Dag } from 'components/saksoversikt/meldekortoversikt/meldekortTypes';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

interface FormFields {
  begrunnelse: string;
  årsak: string;
  meldedato: string;
  dager: Dag[];
}

export const RedigerMeldekortModal = ({ isOpen, setIsOpen }: Props) => {
  const { form, formFields } = useConfigForm<FormFields>({
    begrunnelse: {
      type: 'textarea',
      label: 'Begrunnelse',
      description: 'Hvorfor gjør du endring, og hva er kilden til informasjonen.',
    },
    årsak: {
      type: 'select',
      options: ['hei', 'hoy'],
      label: 'Årsak',
    },
    meldedato: {
      type: 'date_input',
      label: 'Meldedato',
      description: 'Meldekortet regnes som levert på denne datoen.',
    },
    dager: {
      type: 'fieldArray',
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: 'dager' });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Popup id="dialog-popup-example">
        <Dialog.Header>
          <Dialog.Title>Endre meldekort for uke x - y. fra dato - til dato</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <form>
            <VStack gap={'4'}>
              <FormField form={form} formField={formFields.begrunnelse} />
              <FormField form={form} formField={formFields.årsak} />
              <FormField form={form} formField={formFields.meldedato} />
            </VStack>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.CloseTrigger>
            <Button variant="secondary">Avbryt</Button>
          </Dialog.CloseTrigger>
          <Button type={'button'} onClick={() => setIsOpen(false)}>
            Bekreft
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  );
};
