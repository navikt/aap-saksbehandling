'use client';

import { RadioGroupWrapper } from 'components/form/radiogroupwrapper/RadioGroupWrapper';
import { JaEllerNeiOptions } from 'lib/utils/form';
import { Radio } from '@navikt/ds-react';
import { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import React, { ReactNode } from 'react';

interface Props<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues, any, any>;
  hideLabel?: boolean;
  shouldUnregister?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
  readOnly?: boolean;
  className?: string;
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
        <Radio key={`radio-${option.value}`} value={option.value}>
          {option.label}
        </Radio>
      ))}
    </RadioGroupWrapper>
  );
};
