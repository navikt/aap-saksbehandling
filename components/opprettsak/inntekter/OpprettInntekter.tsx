import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import { Button } from '@navikt/ds-react/Button';
import { HStack, VStack } from '@navikt/ds-react/Stack';
import { Label } from '@navikt/ds-react/Typography';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { validerÅrstall } from 'lib/validation/dateValidation';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

export const OpprettInntekter = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'inntekter',
  });

  return (
    <VStack gap="space-16">
      <Label>Inntekter</Label>

      {fields.map((field, index) => {
        return (
          <div key={field.id}>
            <HStack gap="space-8" align="end">
              <TextFieldWrapper
                label={`Inntekt ${index + 1} Årstall`}
                control={form.control}
                name={`inntekter.${index}.år`}
                type={'text'}
                rules={{ validate: (value) => validerÅrstall(value as string) }}
              />
              <TextFieldWrapper
                label={`Inntekt ${index + 1} Beløp`}
                control={form.control}
                name={`inntekter.${index}.beløp`}
                type={'number'}
                rules={{ required: 'Du må oppgi en inntekt' }}
              />
              <Button
                type="button"
                variant={'tertiary'}
                size={'small'}
                icon={<TrashIcon aria-hidden />}
                onClick={() => remove(index)}
                className={'fit-content'}
              >
                Fjern
              </Button>
            </HStack>
          </div>
        );
      })}

      <div>
        <Button
          type="button"
          className={'fit-content'}
          size={'small'}
          onClick={() => {
            append({ år: '', beløp: '' });
          }}
          variant={'tertiary'}
          icon={<PlusIcon aria-hidden />}
        >
          Legg til
        </Button>
      </div>
    </VStack>
  );
};
