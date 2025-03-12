import { RadioGroup } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { Control, Controller, RegisterOptions, FieldValues, FieldPath } from 'react-hook-form';

import styles from './RadioGroupWrapper.module.css';

interface RadioProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  control: Control<FormFieldValues>;
  children: ReactNode;
  hideLabel?: boolean;
  label?: string;
  size?: 'small' | 'medium';
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  horisontal?: boolean;
  readOnly?: boolean;
  className?: string;
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
  readOnly,
  className,
}: RadioProps<FormFieldValues>) => {
  const classNames = `${className} ${horisontal ? styles.radiowrapper_horizontal : ''}`;
  return (
    <div className={styles.radiowrapper_radiogroup}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <RadioGroup
              id={name}
              size={size}
              value={value || ''}
              hideLegend={hideLabel}
              name={name}
              legend={label}
              error={error?.message}
              onChange={onChange}
              description={description}
              className={classNames}
              readOnly={readOnly}
            >
              {children}
            </RadioGroup>
          );
        }}
      />
    </div>
  );
};

export { RadioGroupWrapper };
