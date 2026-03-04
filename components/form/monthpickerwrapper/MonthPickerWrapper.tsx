import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { Control, FieldPath, FieldValues, RegisterOptions, useController } from 'react-hook-form';
import React from 'react';
import { format, isValid } from 'date-fns';
import { isDate } from 'lodash';

const formatDateToLocaleDateOrEmptyString = (date: Date | undefined) =>
  date === undefined ? '' : format(date, 'yyyy-MM-dd'); // TODO HVilket format er best?

export interface MonthPickerProps<FormFieldValues extends FieldValues> {
  control: Control<FormFieldValues>;
  name: FieldPath<FormFieldValues>;
  label?: string;
  description?: React.ReactNode;
  disableWeekends?: boolean;
  rules?: Omit<RegisterOptions<FormFieldValues>, 'validate'>;
  fromDate?: Date;
  size?: 'small' | 'medium';
  toDate?: Date;
  hideLabel?: boolean;
  selected?: Date;
  readOnly?: boolean;
  strategy?: 'absolute' | 'fixed';
  onChangeCustom?: (event: React.SyntheticEvent) => void;
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
}: MonthPickerProps<FormFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: (value) => (isDate(value) && isValid(value)) || 'Ugyldig dato',
    },
  });

  const { monthpickerProps, inputProps } = useMonthpicker({
    onMonthChange: (date) => date && field.onChange(formatDateToLocaleDateOrEmptyString(date)),
    defaultSelected: field.value ? new Date(field.value) : undefined,
  });

  return (
    <MonthPicker {...monthpickerProps}>
      <MonthPicker.Input
        {...inputProps}
        id={field.name}
        label={label}
        description={description}
        hideLabel={hideLabel}
        error={error?.message}
        readOnly={readOnly}
        size={size}
      />
    </MonthPicker>
  );
}
