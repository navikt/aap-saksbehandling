import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, HStack, Label, VStack } from '@navikt/ds-react';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSak';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

export const Sykepenger = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sykepenger',
  });

  return (
    <VStack gap={'2'}>
      <Label>Samordning, sykepenger</Label>
      {fields.map((field, index) => {
        return (
          <HStack key={field.id} gap={'2'} align={'end'}>
            <TextFieldWrapper label={`Grad`} control={form.control} name={`sykepenger.${index}.grad`} type={'text'} />
            <DateInputWrapper label={`Fra og med`} control={form.control} name={`sykepenger.${index}.periode.fom`} />
            <DateInputWrapper label={`Til og med`} control={form.control} name={`sykepenger.${index}.periode.tom`} />
            <Button
              type="button"
              variant={'tertiary'}
              size={'small'}
              icon={<TrashIcon aria-hidden />}
              onClick={() => remove(index)}
            >
              Fjern samordning
            </Button>
          </HStack>
        );
      })}
      <Button
        type="button"
        className={'fit-content'}
        size={'small'}
        onClick={() => {
          append({ grad: 100, periode: { fom: '', tom: '' } });
        }}
        variant={'tertiary'}
        icon={<PlusIcon aria-hidden />}
      >
        Legg til samordning
      </Button>
    </VStack>
  );
};
