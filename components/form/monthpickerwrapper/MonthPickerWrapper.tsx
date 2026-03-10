import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { Control, FieldPath, FieldValues, RegisterOptions, useController, UseFormReturn } from 'react-hook-form';
import React from 'react';
import { format } from 'date-fns';

const formatDateToLocaleDateOrEmptyString = (date: Date | undefined) =>
  date === undefined ? '' : format(date, 'yyyy-MM');

export interface MonthPickerProps<FormFieldValues extends FieldValues> {
  control: Control<FormFieldValues>;
  name: FieldPath<FormFieldValues>;
  form: UseFormReturn<FormFieldValues>;
  className?: string;
  hideErrorMessage?: boolean;
  label?: string;
  description?: React.ReactNode;
  rules?: RegisterOptions<FormFieldValues>;
  size?: 'small' | 'medium';
  hideLabel?: boolean;
  readOnly?: boolean;
}

export function MonthPickerWrapper<FormFieldValues extends FieldValues>({
  name,
  control,
  rules,
  size,
  hideLabel,
  description,
  label,
  readOnly,
  form,
  className,
  hideErrorMessage = false,
}: MonthPickerProps<FormFieldValues>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules: {
      ...rules,
    },
  });

  const { monthpickerProps, inputProps } = useMonthpicker({
    onMonthChange: (date) => date && field.onChange(formatDateToLocaleDateOrEmptyString(date)),
    defaultSelected: field.value ? new Date(field.value) : undefined,
    onValidate: (val) => {
      console.log('val', val);
      if (!val.isValidMonth) {
        form.setError(name, { message: 'Ugyldig datoformat' });
      } else {
        form.clearErrors(name);
      }
    },
  });

  return (
    <MonthPicker {...monthpickerProps}>
      <MonthPicker.Input
        {...inputProps}
        id={field.name}
        label={label}
        description={description}
        hideLabel={hideLabel}
        error={hideErrorMessage ? '' : fieldState.error?.message}
        className={className}
        readOnly={readOnly}
        size={size}
      />
    </MonthPicker>
  );
}
