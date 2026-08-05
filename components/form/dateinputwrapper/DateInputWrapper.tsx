import { TextField } from '@navikt/ds-react';
import React, { FocusEventHandler, HTMLInputAutoCompleteAttribute, ReactNode } from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

import styles from './DateInputWrapper.module.css';
import { mapShortDateToDateString } from './dateMapper';

export type DateInputWrapperProps<FormFieldValues extends FieldValues> = {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  label?: string;
  hideLabel?: boolean;
  size?: 'small' | 'medium';
  shouldUnregister?: boolean;
  description?: ReactNode;
  rules?: RegisterOptions<FormFieldValues>;
  readOnly?: boolean;
  className?: string;
  autocomplete?: HTMLInputAutoCompleteAttribute;
  onChangeCustom?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
};

export const DateInputWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  description,
  rules,
  readOnly,
  shouldUnregister = false,
  size = 'small',
  className,
  hideLabel,
  autocomplete,
  onChangeCustom,
  onBlur,
}: DateInputWrapperProps<FormFieldValues>) => {
  const classNames = `${styles.aap_date_input} ${className}`;
  const transform = (input: React.ChangeEvent<HTMLInputElement>) => mapShortDateToDateString(input.currentTarget.value);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { name, value, onChange }, fieldState: { error } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(transform(e));
          if (onChangeCustom) {
            onChangeCustom(e);
          }
        };

        return (
          <TextField
            id={name}
            name={name}
            size={size}
            label={label}
            hideLabel={hideLabel}
            type={'text'}
            error={error?.message}
            value={value || ''}
            onChange={handleChange}
            description={description}
            readOnly={readOnly}
            className={classNames}
            autoComplete={autocomplete}
            onBlur={onBlur}
          />
        );
      }}
    />
  );
};
