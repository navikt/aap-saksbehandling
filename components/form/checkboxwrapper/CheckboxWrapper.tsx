import { CheckboxGroup } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

interface CheckboxProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  children: ReactNode;
  hideLabel?: boolean;
  size?: 'small' | 'medium';
  label?: string;
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  readOnly?: boolean;
  className?: string;
}

const CheckboxWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  children,
  size = 'small',
  description,
  hideLabel,
  readOnly,
  className,
}: CheckboxProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <CheckboxGroup
        size={size}
        id={name}
        name={name}
        legend={label}
        hideLegend={hideLabel}
        description={description}
        error={error?.message}
        value={value || []}
        onChange={onChange}
        readOnly={readOnly}
        className={className}
      >
        {children}
      </CheckboxGroup>
    )}
  />
);

export { CheckboxWrapper };
