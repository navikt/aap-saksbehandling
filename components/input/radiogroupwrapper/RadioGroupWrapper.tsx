import { RadioGroup } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

import styles from '../radiogroupwrapper/Radio.module.css';

interface RadioProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  children: ReactNode;
  label: string;
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
}

export const RadioGroupWrapper = <FormFieldValues extends FieldValues>({
  children,
  name,
  control,
  rules,
  description,
  label,
  horisontal = false,
}: RadioProps<FormFieldValues>) => {
  console.log('Rendering!!!!', control);
  return (
    <div className={styles.radiogroup}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          console.log({ value });
          return (
            <RadioGroup
              id={name}
              value={value}
              name={name}
              legend={label}
              error={error?.message}
              onChange={onChange}
              description={description}
              className={horisontal ? styles.horizontal : ''}
            >
              {children}
            </RadioGroup>
          );
        }}
      />
    </div>
  );
};
