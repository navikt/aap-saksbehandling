'use client';

import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaverny/MineOppgaverNy';
import { clientSøkPåSaksbehandler } from 'lib/clientApi';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { UseFormReturn } from 'react-hook-form';
import { ValuePair } from 'components/form/FormField';
import { useCallback } from 'react';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  enheter: string[];
}

export const SaksbehandlerFilterSøk = ({ form, enheter }: Props) => {
  function hentOptions(søkestring: string) {
    return clientSøkPåSaksbehandler([], søkestring, enheter).then((res) =>
      res.type === 'SUCCESS'
        ? res.data.saksbehandlere.map((saksbehandler) => ({
            label: saksbehandler.navn || 'Ukjent',
            value: saksbehandler.navIdent,
          }))
        : []
    );
  }

  const loadOptionsDebounced = useCallback(
    debounce((inputValue: string, callback: (options: ValuePair[]) => void) => {
      hentOptions(inputValue).then((options) => callback(options));
    }, 3000),
    []
  );

  return (
    <AsyncComboSearch
      label={'Saksbehandlere'}
      isMulti={true}
      form={form}
      name={`saksbehandlere`}
      // @ts-ignore
      fetcher={loadOptionsDebounced}
    />
  );
};

function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay = 250
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
