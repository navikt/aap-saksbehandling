import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { OpprettSakFormFields } from 'components/opprettsak/OpprettSakLocal';
import styles from 'components/opprettsak/OpprettSak.module.css';
import { Button, Label } from '@navikt/ds-react';
import { PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { JaEllerNei } from 'lib/utils/form';
import { validerÅrstall } from 'lib/validation/dateValidation';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';

interface Props {
  form: UseFormReturn<OpprettSakFormFields>;
}

export const OpprettSakBarn = ({ form }: Props) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'barn',
  });

  return (
    <div className={'flex-column'}>
      <Label>Barn</Label>
      {fields.map((field, index) => {
        return (
          <div key={field.id} className={'flex-column'}>
            <div>
              <div className={styles.barn}>
                <TextFieldWrapper
                  label={`Barn ${index + 1} Årstall`}
                  control={form.control}
                  name={`barn.${index}.fodselsdato`}
                  type={'text'}
                  rules={{ validate: (value) => validerÅrstall(value as string) }}
                />
                <SelectWrapper label={'Hvilket barn er det?'} name={`barn.${index}.harRelasjon`} control={form.control}>
                  <option value={'manueltBarn'}>Manuelt barn</option>
                  <option value={'folkeregistrertBarn'}>Folkeregistrert barn</option>
                </SelectWrapper>
                <SelectWrapper
                  label={'Skal barnet finnes i PDL?'}
                  name={`barn.${index}.skalFinnesIPDL`}
                  control={form.control}
                >
                  <option value={'true'}>Ja</option>
                  <option value={'false'}>Nei</option>
                </SelectWrapper>
                <Button
                  type="button"
                  variant={'tertiary'}
                  size={'small'}
                  icon={<TrashIcon aria-hidden />}
                  onClick={() => remove(index)}
                  className={'fit-content'}
                >
                  Fjern barn
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
                    append({ fodselsdato: '', harRelasjon: JaEllerNei.Ja, skalFinnesIPDL: 'true' });
                  }}
                  variant={'tertiary'}
                  icon={<PlusIcon aria-hidden />}
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
