import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSak';
import styles from 'components/opprettsak/OpprettSak.module.css';
import { Button, Select, TextField } from '@navikt/ds-react';
import { validerÅrstall } from 'lib/utils/validation';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { JaEllerNei } from 'lib/utils/form';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

export const OpprettSakBarn = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'barn',
  });

  return (
    <div>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className={'flex-column'}>
            <div>
              <div className={styles.barn}>
                <TextField
                  size={'small'}
                  label={`Barn ${index + 1} Årstall`}
                  {...form.register(`barn.${index}.fodselsdato`, { validate: (value) => validerÅrstall(value) })}
                  error={
                    form?.formState?.errors?.barn ? form.formState.errors.barn[index]?.fodselsdato?.message : undefined
                  }
                />
                <Select
                  label={'Hvilket barn er det?'}
                  size={'small'}
                  {...form.register(`barn.${index}.harRelasjon`)}
                  name={`barn.${index}.harRelasjon`}
                >
                  <option value={'manueltBarn'}>Manuelt barn</option>
                  <option value={'folkeregistrertBarn'}>Folkeregistrert barn</option>
                </Select>
                <Button
                  type="button"
                  variant={'tertiary'}
                  size={'small'}
                  icon={<TrashIcon />}
                  onClick={() => remove(index)}
                  className={'fit-content-button'}
                >
                  Fjern barn
                </Button>
              </div>
            </div>
            <div className={'flex-row'}>
              {fields.length === index + 1 && (
                <Button
                  type="button"
                  className={'fit-content-button'}
                  size={'small'}
                  onClick={() => {
                    append({ fodselsdato: '', harRelasjon: JaEllerNei.Ja });
                  }}
                  variant={'tertiary'}
                  icon={<PlusIcon />}
                >
                  Legg til barn
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
