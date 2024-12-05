import { Controller, FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { ErrorMessage, Label } from '@navikt/ds-react';
import { customStyles } from './AsyncComboSearchStyling';
import { ValuePair } from '@navikt/aap-felles-react';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import styles from './AsyncComboSearch.module.css';
import AsyncSelect from 'react-select/async';

type Props<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  name: FieldPath<FormValues>;
  label: string;
  fetcher: (input: string) => Promise<ValuePair[]>;
  readOnly?: boolean;
  defaultOptions?: ValuePair[];
  isMulti?: boolean;
  rules?: RegisterOptions<FormValues>;
};

export const AsyncComboSearch = <FormValues extends FieldValues>({
  form,
  name,
  label,
  fetcher,
  readOnly = false,
  defaultOptions,
  isMulti = false,
  rules,
}: Props<FormValues>) => {
  return (
    <Controller
      name={name}
      control={form.control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={styles.combosearch}>
          <div className={styles.labelwrapper}>
            {readOnly && <PadlockLockedFillIcon />}
            <Label size={'small'} htmlFor={name}>
              {label}
            </Label>
          </div>
          <AsyncSelect
            isDisabled={readOnly}
            inputId={name}
            isMulti={isMulti}
            placeholder=""
            isClearable
            value={field.value}
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
};
