import { Controller, FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import { ErrorMessage, Label, Skeleton } from '@navikt/ds-react';
import { customStyles } from './AsyncComboSearchStyling';
import { ValuePair } from '@navikt/aap-felles-react';
import { PadlockLockedFillIcon } from '@navikt/aksel-icons';

import styles from './AsyncComboSearch.module.css';
import dynamic from 'next/dynamic';

const AsyncSelectWithoutSSR = dynamic(() => import('react-select/async'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangle" height={'36px'} />,
});

type Props<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  name: FieldPath<FormValues>;
  label: string;
  fetcher: (input: string) => Promise<ValuePair[]>;
  readOnly?: boolean;
  defaultOptions?: ValuePair[];
  isMulti?: boolean;
  rules?: RegisterOptions<FormValues>;
  size?: 'small' | 'medium';
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
  size = 'medium',
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
            <Label size={size} htmlFor={name}>
              {label}
            </Label>
          </div>
          <AsyncSelectWithoutSSR
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
