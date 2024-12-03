import { TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';

interface FormValues {
  kommunenummer: string;
  kommunenummer_input: string;
  kode: string;
}

interface Props {
  form: UseFormReturn<FormValues>;
}

const ComboSearch2 = ({ form }: Props) => {
  const [results, setResults] = useState<string[]>([]);
  const fetchData = async (query: string) => {
    if (query.length > 3) return;
    try {
      const res = await fetch(`/api/test/search/${query}`, { method: 'GET' });
      const data: string[] = await res.json();
      console.log(data);
      setResults(data);
    } catch (error) {
      console.error(`Noe gikk galt: ${error}`);
      setResults([]);
    }
  };

  const velg = (result: string) => {
    form.setValue('kommunenummer', result);
    form.setValue('kommunenummer_input', result);
  };

  return (
    <>
      <Controller
        name="kommunenummer_input"
        control={form.control}
        defaultValue=""
        rules={{
          validate: () => (form.getValues('kommunenummer').length > 0 ? undefined : 'Du må velge et kommunenummer'),
        }}
        render={({ field, fieldState }) => (
          <div>
            <TextField
              label={'Kommune'}
              {...field}
              type="text"
              placeholder="Search..."
              onChange={(event) => {
                field.onChange(event);
                fetchData(event.currentTarget.value);
              }}
              error={fieldState.error?.message}
            />
          </div>
        )}
      />
      <input {...form.register('kommunenummer', { required: 'Du må velge en behandler' })} type="hidden" />
      {results.length > 0 && (
        <ul>
          {results.map((k) => (
            <li key={k} onClick={() => velg(k)} onKeyUp={() => velg(k)} role="option">
              {k}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export const FormTesting = () => {
  const form = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <ComboSearch2 form={form} />
      <Controller
        name="kode"
        control={form.control}
        defaultValue=""
        rules={{ required: 'Du må fylle ut en kode' }}
        render={({ field, fieldState }) => <TextField {...field} label={'Kode'} error={fieldState.error?.message} />}
      />
      <button>Send inn!</button>
    </form>
  );
};
