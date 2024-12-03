import { Controller, FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { ValuePair } from '@navikt/aap-felles-react';
import { ErrorMessage, Label } from '@navikt/ds-react';
import { customStyles } from 'components/input/asynccombosearch/AsyncComboSearchStyling';

type Props<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  feltnavn: FieldPath<FormValues>;
  label: string;
  fetcher: (input: string) => Promise<ValuePair[]>;
  isMulti?: boolean;
  rules?: RegisterOptions<FormValues>;
};

export const AsyncComboSearch = <FormValues extends FieldValues>({
  form,
  feltnavn,
  label,
  fetcher,
  isMulti = false,
  rules,
}: Props<FormValues>) => (
  <Controller
    name={feltnavn}
    control={form.control}
    rules={rules}
    render={({ field, fieldState }) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label size={'small'} htmlFor={'combosearchbox'}>
          {label}
        </Label>
        <AsyncSelect
          inputId="combosearchbox"
          isMulti={isMulti}
          placeholder=""
          isClearable
          onChange={(value) => {
            field.onChange(value);
          }}
          loadingMessage={() => 'Søker...'}
          noOptionsMessage={() => 'Ingen treff'}
          loadOptions={fetcher}
          styles={customStyles}
        />
        {fieldState.error && <ErrorMessage size={'small'}>{fieldState.error.message}</ErrorMessage>}
      </div>
    )}
  />
);
