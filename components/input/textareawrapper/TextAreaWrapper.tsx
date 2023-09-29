import { Textarea } from '@navikt/ds-react';
import React from 'react';
import { Control, Controller, FieldValues, RegisterOptions } from 'react-hook-form';
import { FieldPath } from 'react-hook-form/dist/types';

export interface TextAreaProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  description?: React.ReactNode;
  label: string;
  rules?: RegisterOptions<FormFieldValues>;
  control: Control<FormFieldValues>;
  maxLength?: number;
  readOnly?: boolean;
}

export const TextAreaWrapper = <FormFieldValues extends FieldValues>({
  name,
  description,
  label,
  control,
  maxLength,
  rules,
  readOnly,
}: TextAreaProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange }, fieldState: { error } }) => (
      <Textarea
        id={name}
        label={label}
        description={description}
        value={value}
        onChange={onChange}
        error={error?.message}
        name={name}
        maxLength={maxLength}
        readOnly={readOnly}
      />
    )}
  />
);
