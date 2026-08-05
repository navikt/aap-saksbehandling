'use client';

import { Radio } from '@navikt/ds-react';
import { JaEllerNeiOptions } from 'lib/utils/form';
import React, { FocusEventHandler, ReactNode } from 'react';
import { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';

interface Props<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  hideLabel?: boolean;
  shouldUnregister?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
  readOnly?: boolean;
  className?: string;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
}

export const RadioGroupJaNei = <FormFieldValues extends FieldValues>({
  name,
  control,
  rules,
  description,
  hideLabel = false,
  label,
  size = 'small',
  horisontal = false,
  shouldUnregister = false,
  readOnly,
  className,
  onBlur,
}: Props<FormFieldValues>) => {
  return (
    <RadioGroupWrapper
      name={name}
      control={control}
      label={label}
      hideLabel={hideLabel}
      description={description}
      rules={rules}
      shouldUnregister={shouldUnregister}
      readOnly={readOnly}
      size={size}
      horisontal={horisontal}
      className={className}
    >
      {JaEllerNeiOptions.map((option) => (
        <Radio key={`radio-${option.value}`} value={option.value} onBlur={onBlur}>
          {option.label}
        </Radio>
      ))}
    </RadioGroupWrapper>
  );
};
