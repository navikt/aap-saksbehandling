import { Switch } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

export interface SwitchProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  control: Control<FormFieldValues>;
  hideLabel?: boolean;
  rules?: RegisterOptions<FormFieldValues>;
  size?: 'small' | 'medium';
  description?: ReactNode;
  readOnly?: boolean;
  className?: string;
}

export const SwitchWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  size = 'small',
  hideLabel,
  readOnly,
  className,
}: SwitchProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { name, value, onChange } }) => (
      <Switch
        id={name}
        name={name}
        size={size}
        value={value}
        hideLabel={hideLabel}
        onChange={onChange}
        readOnly={readOnly}
        className={className}
      >
        {label}
      </Switch>
    )}
  />
);
