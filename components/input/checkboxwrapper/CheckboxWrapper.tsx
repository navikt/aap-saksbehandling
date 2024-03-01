import { CheckboxGroup } from '@navikt/ds-react';
import { ReactNode } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';

interface CheckboxProps<FormFieldValues extends FieldValues> {
  name: FieldPath<FormFieldValues>;
  label?: string;
  control: Control<FormFieldValues>;
  children: ReactNode;
  rules?: RegisterOptions<FormFieldValues>;
  description?: ReactNode;
  readOnly?: boolean;
}

const CheckboxWrapper = <FormFieldValues extends FieldValues>({
  name,
  label,
  control,
  rules,
  children,
  description,
  readOnly,
}: CheckboxProps<FormFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <CheckboxGroup
        size={'medium'}
        id={name}
        name={name}
        legend={label}
        description={description}
        error={error?.message}
        value={value || []}
        onChange={onChange}
        readOnly={readOnly}
      >
        {children}
      </CheckboxGroup>
    )}
  />
);

export { CheckboxWrapper };
