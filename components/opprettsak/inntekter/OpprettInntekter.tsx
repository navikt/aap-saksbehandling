import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSak';
import styles from 'components/opprettsak/OpprettSak.module.css';
import { Button, Label } from '@navikt/ds-react';
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
    <div className={'flex-column'}>
      <Label>Inntekter</Label>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className={'flex-column'}>
            <div>
              <div className={styles.barn}>
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
                  Fjern inntekt
                </Button>
              </div>
            </div>
            <div className={'flex-row'}>
              {fields.length === index + 1 && (
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
                  Legg til inntekt
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
