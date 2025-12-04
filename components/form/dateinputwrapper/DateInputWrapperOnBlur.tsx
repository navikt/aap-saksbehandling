import { TextField } from '@navikt/ds-react';
import React, { HTMLInputAutoCompleteAttribute, useState } from 'react';
import { ReactNode } from 'react';
import { Control, Controller, FieldError, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { mapShortDateToDateString } from './dateMapper';

import styles from './DateInputWrapper.module.css';

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
  onChangeCustom?: (event: React.FormEvent<HTMLInputElement>) => void;
};

export const DateInputWrapperOnBlur = <FormFieldValues extends FieldValues>({
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
}: DateInputWrapperProps<FormFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { name, value, onChange }, fieldState: { error } }) => (
        <RenderDateField
          name={name}
          label={label}
          description={description}
          readOnly={readOnly}
          size={size}
          className={className}
          hideLabel={hideLabel}
          autocomplete={autocomplete}
          onChangeCustom={onChangeCustom}
          value={value}
          onChange={onChange}
          error={error}
        />
      )}
    />
  );
};
interface Props<FormFieldValues extends FieldValues> extends DateInputWrapperProps<FormFieldValues> {
  value: string;
  onChange: (...event: any[]) => void;
  error: FieldError | undefined;
}

function transform(input: React.FormEvent<HTMLInputElement>) {
  return mapShortDateToDateString(input.currentTarget.value);
}

export const RenderDateField = <FormFieldValues extends FieldValues>({
  value,
  onChange,
  onChangeCustom,
  name,
  size,
  label,
  hideLabel,
  error,
  className,
  description,
  readOnly,
  autocomplete,
}: Partial<Props<FormFieldValues>>) => {
  const classNames = `${styles.aap_date_input} ${className}`;
  const [localVal, setLocalVal] = useState<string>(value || '');

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    onChange && onChange(transform(e));
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
      value={localVal}
      onChange={(e) => setLocalVal(transform(e))}
      description={description}
      readOnly={readOnly}
      className={classNames}
      autoComplete={autocomplete}
      onBlur={handleChange}
    />
  );
};
