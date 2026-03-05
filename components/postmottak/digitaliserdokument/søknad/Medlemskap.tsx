import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { FieldPath, useFieldArray, UseFormReturn } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { JaEllerNei, JaNeiIkkeOppgitt } from 'lib/postmottakForm';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { LeggTilUtenlandsOpphold } from './LeggTilUtenlandsOpphold';

interface Props {
  form: UseFormReturn<SøknadFormFields>;
  formFields: FormFields<FieldPath<SøknadFormFields>, SøknadFormFields>;
  readOnly: boolean;
}

export const Medlemskap = ({ form, formFields, readOnly }: Props) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'utenlandsOpphold' });
  const harBoddINorgeSiste5År = form.watch('harBoddINorgeSiste5År');
  const arbeidetUtenforNorgeFørSykdom = form.watch('arbeidetUtenforNorgeFørSykdom');
  const harArbeidetINorgeSiste5År = form.watch('harArbeidetINorgeSiste5År');
  const iTilleggArbeidUtenforNorge = form.watch('iTilleggArbeidUtenforNorge');

  return (
    <VStack gap={'3'}>
      <FormField form={form} formField={formFields.harBoddINorgeSiste5År} />
      {harBoddINorgeSiste5År === JaNeiIkkeOppgitt.JA && (
        <>
          <FormField form={form} formField={formFields.harArbeidetINorgeSiste5År} />
          <FormField form={form} formField={formFields.arbeidetUtenforNorgeFørSykdom} />
        </>
      )}
      {harBoddINorgeSiste5År === JaNeiIkkeOppgitt.NEI && harArbeidetINorgeSiste5År === JaNeiIkkeOppgitt.JA && (
        <FormField form={form} formField={formFields.iTilleggArbeidUtenforNorge} />
      )}
      {(iTilleggArbeidUtenforNorge === JaNeiIkkeOppgitt.JA ||
        harArbeidetINorgeSiste5År === JaNeiIkkeOppgitt.JA ||
        arbeidetUtenforNorgeFørSykdom === JaNeiIkkeOppgitt.JA) && (
        <VStack gap={'2'}>
          <Label size={'small'}>Utenlandsopphold</Label>
          {fields.map((field, i) => (
            <LeggTilUtenlandsOpphold
              key={field.id}
              i={i}
              form={form}
              readOnly={readOnly}
              remove={remove}
            />
          ))}
          <HStack>
            <Button
              variant={'secondary'}
              icon={<PlusCircleFillIcon title={'Legg til utenlandsopphold'} />}
              disabled={readOnly}
              size={'small'}
              type={'button'}
              onClick={() => append({ land: '', fraDato: '', tilDato: '', iArbeid: JaEllerNei.Ja })}
            >
              Legg til utenlandsopphold
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
};
