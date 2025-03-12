import { Control, Controller, RegisterOptions, FieldPath, FieldValues } from 'react-hook-form';
import React, { ReactNode } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ValuePair } from '../FormField';

interface ComboboxProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  options: ValuePair[];
  hideLabel?: boolean;
  isMultiSelect?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  readOnly?: boolean;
  className?: string;
}

const MultipleComboboxWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  description,
  hideLabel,
  size = 'small',
  readOnly,
  options,
  className,
}: ComboboxProps<FormFieldValues>) => {

  return (
    <Controller
      control={control}
      rules={rules}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <UNSAFE_Combobox
            shouldAutocomplete={false}
            id={name}
            label={label}
            options={options}
            isMultiSelect
            hideLabel={hideLabel}
            description={description}
            error={fieldState.error?.message}
            readOnly={readOnly}
            className={className}
            selectedOptions={field.value?.map((value) => {
              const option = options.find((option) => option.value === value);
              if (option) {
                return option;
              }
            })}
            ref={field.ref}
            name={field.name}
            size={size}
            onBlur={field.onBlur}
            onToggleSelected={(option, isSelected) => {
              if (isSelected) {
                field.onChange([...(field.value || []), option]);
              } else {
                field.onChange(field.value.filter((v: string) => v !== option));
              }
            }}
          />
        );
      }}
    />
  );
};

export { MultipleComboboxWrapper };
