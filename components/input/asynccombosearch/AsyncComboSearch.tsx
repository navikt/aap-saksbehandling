import React from 'react';
import { Controller, FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { ErrorMessage, Label } from '@navikt/ds-react';
import { customStyles } from './AsyncComboSearchStyling';
import { ValuePair } from '@navikt/aap-felles-react';

type Props<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  name: FieldPath<FormValues>;
  label: string;
  fetcher: (input: string) => Promise<ValuePair[]>;
  defaultOptions?: ValuePair[] | boolean;
  isMulti?: boolean;
  rules?: RegisterOptions<FormValues>;
};

export const AsyncComboSearch = <FormValues extends FieldValues>({
  form,
  name,
  label,
  fetcher,
  defaultOptions,
  isMulti = false,
  rules,
}: Props<FormValues>) => (
  <Controller
    name={name}
    control={form.control}
    rules={rules}
    render={({ field, fieldState }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label size={'small'} htmlFor={name}>
          {label}
        </Label>
        <AsyncSelect
          inputId={name}
          isMulti={isMulti}
          placeholder=""
          isClearable
          onChange={(value) => {
            field.onChange(value);
          }}
          loadingMessage={() => 'Søker...'}
          noOptionsMessage={() => 'Ingen treff'}
          loadOptions={fetcher}
          defaultOptions={defaultOptions}
          styles={customStyles}
        />
        {fieldState.error && <ErrorMessage size={'small'}>{fieldState.error.message}</ErrorMessage>}
      </div>
    )}
  />
);
