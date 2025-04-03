import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { addYears, isValid, subYears } from 'date-fns';
import React from 'react';
import { Control, FieldPath, FieldValues, RegisterOptions, useController } from 'react-hook-form';
import { isDate } from 'lodash';

export interface DateProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  description?: React.ReactNode;
  disableWeekends?: boolean;
  rules?: Omit<RegisterOptions<FormFieldValues>, 'validate'>;
  control: Control<FormFieldValues>;
  fromDate?: Date;
  size?: 'small' | 'medium';
  toDate?: Date;
  hideLabel?: boolean;
  selected?: Date;
  readOnly?: boolean;
  strategy?: 'absolute' | 'fixed';
}

const FRA_DATO = subYears(new Date(), 80);
const TIL_DATO = addYears(new Date(), 80);

export const DateWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  description,
  control,
  rules,
  disableWeekends = false,
  size = 'small',
  hideLabel,
  fromDate = FRA_DATO,
  toDate = TIL_DATO,
  selected,
  readOnly,
  strategy,
}: DateProps<FormFieldValues>) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...rules,
      validate: (value) => (isDate(value) && isValid(value)) || 'Dato må være i formatet "dd.MM.åååå"',
    },
  });

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: selected,
    onDateChange: (date) => onChange(date),
    toDate,
    fromDate,
    disableWeekends,
  });

  return (
    <DatePicker
      {...datepickerProps}
      id={name}
      dropdownCaption
      strategy={strategy}
    >
      <DatePicker.Input
        onChange={onChange}
        onInput={onChange}
        size={size}
        value={value}
        name={name}
        hideLabel={hideLabel}
        description={description}
        error={error?.message}
        label={label}
        readOnly={readOnly}
        {...inputProps}
      />
    </DatePicker>
  );
};
