import { RadioGroup } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

interface RadioProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  children: ReactNode;
  label?: string;
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
  readOnly?: boolean;
}

const RadioGroupWrapper = <FormFieldValues extends FieldValues>({
  children,
  name,
  control,
  rules,
  description,
  label,
  horisontal = false,
  readOnly,
}: RadioProps<FormFieldValues>) => {
  return (
    <div className="radiowrapper_radiogroup">
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <RadioGroup
              id={name}
              size={'small'}
              value={value || ''}
              name={name}
              legend={label}
              error={error?.message}
              onChange={onChange}
              description={description}
              className={horisontal ? 'radiowrapper_horizontal' : ''}
              readOnly={readOnly}
            >
              {children}
            </RadioGroup>
          );
        }}
      />
    </div>
  );
};

export { RadioGroupWrapper };
