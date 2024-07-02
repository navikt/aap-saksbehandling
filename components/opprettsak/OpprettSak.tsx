'use client';

import { opprettSak } from 'lib/clientApi';
import { useConfigForm } from 'hooks/FormHook';
import { FormField } from 'components/input/formfield/FormField';
import { Button, Label, TextField } from '@navikt/ds-react';

import styles from './OpprettSak.module.css';
import { mutate } from 'swr';
import { useFieldArray } from 'react-hook-form';
import { formaterDatoForBackend } from 'lib/utils/date';
import { MinusIcon, PlusIcon } from '@navikt/aksel-icons';

interface Barn {
  fodselsdato: string;
}

interface FormFields {
  fødselsdato: Date;
  yrkesskade: string;
  student: string;
  barn: Barn[];
}

export const OpprettSak = () => {
  const { formFields, form } = useConfigForm<FormFields>({
    fødselsdato: {
      type: 'date',
      defaultValue: new Date('2000-01-01'),
      label: 'Fødselsdato',
    },
    yrkesskade: {
      type: 'radio',
      label: 'Yrkesskade?',
      defaultValue: 'true',
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
    student: {
      type: 'radio',
      label: 'Student?',
      defaultValue: 'false',
      options: [
        { label: 'Ja', value: 'true' },
        { label: 'Nei', value: 'false' },
      ],
    },
    barn: {
      type: 'date',
      label: 'Ikke relevant',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'barn',
  });

  return (
    <form
      onSubmit={form.handleSubmit(async (data) => {
        await opprettSak({
          ...data,
          fødselsdato: formaterDatoForBackend(data.fødselsdato),
          yrkesskade: data.yrkesskade === 'true',
          student: data.student === 'true',
          barn: data.barn.map((barn) => {
            return { fodselsdato: formaterDatoForBackend(new Date(barn.fodselsdato)) };
          }),
        });
        await mutate('api/sak/alle');
      })}
      className={styles.form}
    >
      <FormField form={form} formField={formFields.fødselsdato} />
      <FormField form={form} formField={formFields.yrkesskade} />
      <FormField form={form} formField={formFields.student} />
      {fields.map((field, index) => {
        return (
          <div key={field.id} className={'flex-column'}>
            <div>
              <Label>Barn {index + 1}</Label>
              <TextField size={'small'} label={'Årstall'} {...form.register(`barn.${index}.fodselsdato`)} />
            </div>
            <div className={'flex-row'}>
              <Button
                variant={'danger'}
                size={'small'}
                icon={<MinusIcon />}
                onClick={() => remove(index)}
                className={'fit-content-button'}
              >
                Fjern barn
              </Button>
              {fields.length === index + 1 && (
                <Button
                  type="button"
                  className={'fit-content-button'}
                  onClick={() => {
                    append({ fodselsdato: '' });
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

      <Button className={'fit-content-button'}>Opprett test sak</Button>
    </form>
  );
};
