import { UNSAFE_Combobox } from '@navikt/ds-react/Combobox';
import React, { FocusEventHandler, ReactNode } from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { ValuePair } from '../FormField';

interface ComboboxProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  options: ValuePair[];
  hideLabel?: boolean;
  size?: 'small' | 'medium';
  label?: string;
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  readOnly?: boolean;
  className?: string;
  dataUmamiEvent?: string;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}

const ComboboxWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  hideLabel,
  size = 'small',
  rules,
  description,
  readOnly,
  options,
  className,
  dataUmamiEvent,
  onBlur,
}: ComboboxProps<FormFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <UNSAFE_Combobox
          shouldAutocomplete={false}
          size={size}
          id={name}
          data-umami-event={dataUmamiEvent}
          name={name}
          label={label}
          hideLabel={hideLabel}
          description={description}
          error={error?.message}
          options={options}
          onToggleSelected={onChange}
          selectedOptions={[options.find((option) => option.value === value)?.label ?? '']}
          readOnly={readOnly}
          className={className}
          onBlur={onBlur}
        />
      )}
    />
  );
};

export { ComboboxWrapper };
