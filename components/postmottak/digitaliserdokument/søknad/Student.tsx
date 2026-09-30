import { FieldPath, useFormContext } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { JaNeiAvbruttIkkeOppgitt } from 'lib/postmottakForm';
import { VStack } from '@navikt/ds-react';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';

interface Props {
  formFields: FormFields<FieldPath<SøknadFormFields>, SøknadFormFields>;
}

export const Student = ({ formFields }: Props) => {
  const form = useFormContext<SøknadFormFields>();
  const erStudent = form.watch('erStudent');
  return (
    <VStack gap={'space-12'}>
      <FormField form={form} formField={formFields.erStudent} />
      {erStudent === JaNeiAvbruttIkkeOppgitt.AVBRUTT && (
        <FormField form={form} formField={formFields.studentKommeTilbake} />
      )}
    </VStack>
  );
};
