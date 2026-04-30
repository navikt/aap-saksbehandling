import { HStack, RadioGroup } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { createSyntheticEvent } from 'lib/types/SyntheticEvent';

interface RadioProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues, any, any>;
  children: ReactNode;
  hideLabel?: boolean;
  shouldUnregister?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
  readOnly?: boolean;
  className?: string;
  onChangeCustom?: (event: React.SyntheticEvent) => void;
}

const RadioGroupWrapper = <FormFieldValues extends FieldValues>({
  children,
  name,
  control,
  rules,
  description,
  hideLabel,
  label,
  size = 'small',
  horisontal = false,
  shouldUnregister = false,
  readOnly,
  className,
  onChangeCustom,
}: RadioProps<FormFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (val: string) => {
          onChange(val);
          if (onChangeCustom) {
            onChangeCustom(createSyntheticEvent(val));
          }
        };

        return (
          <RadioGroup
            id={name}
            size={size}
            value={value || ''}
            hideLegend={hideLabel}
            name={name}
            legend={label}
            error={error?.message}
            onChange={handleChange}
            description={description}
            className={className}
            readOnly={readOnly}
          >
            <>{horisontal ? <HStack gap={'space-16'}>{children}</HStack> : children}</>
          </RadioGroup>
        );
      }}
    />
  );
};

export { RadioGroupWrapper };
