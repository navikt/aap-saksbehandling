import { Button, Label, VStack } from '@navikt/ds-react';
import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { FieldPath, useFieldArray, useFormContext } from 'react-hook-form';
import { SøknadFormFields } from './DigitaliserSøknad';
import { JaEllerNei } from 'lib/postmottakForm';
import { FormFields } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { LeggTilUtenlandsOpphold } from './LeggTilUtenlandsOpphold';

interface Props {
  formFields: FormFields<FieldPath<SøknadFormFields>, SøknadFormFields>;
  readOnly: boolean;
}

export const MedlemskapV2 = ({ formFields, readOnly }: Props) => {
  const form = useFormContext<SøknadFormFields>();
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'utenlandsOpphold' });
  const harBoddINorgeSiste5År = form.watch('harBoddINorgeSiste5År');
  const arbeidetUtenforNorgeFørSykdom = form.watch('arbeidetUtenforNorgeFørSykdom');
  const harArbeidetINorgeSiste5År = form.watch('harArbeidetINorgeSiste5År');
  const iTilleggArbeidUtenforNorge = form.watch('iTilleggArbeidUtenforNorge');

  const skalViseUtenlandsopphold =
    iTilleggArbeidUtenforNorge === JaEllerNei.Ja ||
    arbeidetUtenforNorgeFørSykdom === JaEllerNei.Ja ||
    harArbeidetINorgeSiste5År === JaEllerNei.Nei;

  return (
    <VStack gap={'space-12'}>
      <FormField form={form} formField={formFields.harBoddINorgeSiste5År} />
      {harBoddINorgeSiste5År === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.arbeidetUtenforNorgeFørSykdom} />
      )}
      {harBoddINorgeSiste5År === JaEllerNei.Nei && (
        <FormField form={form} formField={formFields.harArbeidetINorgeSiste5År} />
      )}
      {harBoddINorgeSiste5År === JaEllerNei.Nei && harArbeidetINorgeSiste5År === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.iTilleggArbeidUtenforNorge} />
      )}
      {skalViseUtenlandsopphold && (
        <VStack gap={'space-8'}>
          <Label size={'small'}>Utenlandsopphold</Label>
          {fields.map((field, index) => (
            <LeggTilUtenlandsOpphold key={field.id} index={index} form={form} readOnly={readOnly} remove={remove} />
          ))}
          <Button
            variant={'secondary'}
            icon={<PlusCircleFillIcon title={'Legg til utenlandsopphold'} />}
            disabled={readOnly}
            size={'small'}
            type={'button'}
            className={'fit-content'}
            onClick={() => append({ land: '', fraDato: '', tilDato: '', iArbeid: JaEllerNei.Ja })}
          >
            Legg til utenlandsopphold
          </Button>
        </VStack>
      )}
    </VStack>
  );
};
