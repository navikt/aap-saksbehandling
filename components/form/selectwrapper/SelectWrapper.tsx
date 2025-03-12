import { Select } from '@navikt/ds-react';
import React, { HTMLInputAutoCompleteAttribute, ReactNode } from 'react';
import { Control, Controller, RegisterOptions, FieldPath, FieldValues } from 'react-hook-form';

export interface SelectProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  control: Control<FormFieldValues>;
  children: React.ReactNode;
  hideLabel?: boolean;
  rules?: RegisterOptions<FormFieldValues>;
  size?: 'small' | 'medium';
  description?: ReactNode;
  readOnly?: boolean;
  className?: string;
  autocomplete?: HTMLInputAutoCompleteAttribute;
}

export const SelectWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  size = 'small',
  description,
  hideLabel,
  children,
  readOnly,
  className,
  autocomplete,
}: SelectProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange }, fieldState: { error } }) => (
      <Select
        id={name}
        name={name}
        size={size}
        label={label}
        description={description}
        value={value}
        hideLabel={hideLabel}
        onChange={onChange}
        error={error?.message}
        readOnly={readOnly}
        className={className}
        autoComplete={autocomplete}
      >
        {children}
      </Select>
    )}
  />
);
