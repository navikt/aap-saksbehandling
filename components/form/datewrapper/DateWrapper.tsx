import { DatePicker, useDatepicker } from '@navikt/ds-react';
import { addYears, isEqual, isValid, subYears } from 'date-fns';
import React, { useEffect } from 'react';
import { Control, FieldPath, FieldValues, RegisterOptions, useController } from 'react-hook-form';
import { isDate } from 'lodash';
import { createSyntheticEvent } from 'lib/types/SyntheticEvent';

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
  onChangeCustom?: (event: React.SyntheticEvent) => void;
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
  onChangeCustom,
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

  const {
    datepickerProps,
    inputProps,
    selectedDay: selectedInternal,
    setSelected,
  } = useDatepicker({
    defaultSelected: selected,
    onDateChange: (date) => {
      onChange(date);
      if (onChangeCustom) {
        onChangeCustom(createSyntheticEvent(date));
      }
    },
    toDate,
    fromDate,
    disableWeekends,
  });

  // Må synce state slik at resetting av felt i rhf også oppdaterer intern state i datepicker
  useEffect(() => {
    if (!value && !selectedInternal) {
      return;
    }

    if (
      (value && !selectedInternal) ||
      (!value && selectedInternal) ||
      (value && selectedInternal && !isEqual(value, selectedInternal))
    ) {
      if (isValid(value)) {
        setSelected(value);
      } else {
        setSelected(undefined);
      }
    }
  }, [value, selectedInternal, setSelected]);

  return (
    <DatePicker {...datepickerProps} id={name} dropdownCaption strategy={strategy}>
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
