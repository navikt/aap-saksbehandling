import { TextField } from '@navikt/ds-react';
import React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { FieldPath } from 'react-hook-form/dist/types';

export interface TextFieldProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  control: Control<FormFieldValues>;
  type: 'text' | 'number';
  description?: React.ReactNode;
  rules?: RegisterOptions<FormFieldValues>;
  readOnly?: boolean;
}

export const TextFieldWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  type,
  description,
  rules,
  readOnly,
}: TextFieldProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange }, fieldState: { error } }) => (
      <TextField
        id={name}
        name={name}
        label={label}
        type={type}
        error={error?.message}
        value={value || ''}
        onChange={onChange}
        description={description}
        readOnly={readOnly}
      />
    )}
  />
);
