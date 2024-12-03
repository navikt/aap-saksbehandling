import { Controller, FieldPath, FieldValues, RegisterOptions, UseFormReturn } from 'react-hook-form';
import AsyncSelect from 'react-select/async';

type Props<FormValues extends FieldValues, SearchResponse> = {
  feltnavn: FieldPath<FormValues>;
  form: UseFormReturn<FormValues>;
  fetcher: (input: string) => Promise<SearchResponse[]>;
  rules?: RegisterOptions<FormValues>;
  customOnChange?: (val: any) => void;
};

export const AsyncComboSearch = <FormValues extends FieldValues, SearchResponse>({
  feltnavn,
  form,
  fetcher,
  rules,
}: Props<FormValues, SearchResponse>) => (
  <Controller
    name={feltnavn}
    control={form.control}
    rules={rules}
    render={({ field }) => (
      <AsyncSelect
        placeholder=""
        isClearable
        onChange={(value) => {
          field.onChange(value);
        }}
        loadingMessage={() => 'Søker...'}
        noOptionsMessage={() => 'Ingen treff'}
        loadOptions={fetcher}
      />
    )}
  />
);
