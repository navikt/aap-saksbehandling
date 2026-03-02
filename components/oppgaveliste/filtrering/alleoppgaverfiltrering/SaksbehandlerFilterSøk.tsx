'use client';

import { clientSaksbehandlerSøk } from 'lib/clientApi';
import { AsyncComboSearch } from 'components/form/asynccombosearch/AsyncComboSearch';
import { UseFormReturn } from 'react-hook-form';
import { ValuePair } from 'components/form/FormField';
import { FormFieldsFilter } from 'components/oppgaveliste/mineoppgaverny/MineOppgaverNy';

interface Props {
  form: UseFormReturn<FormFieldsFilter>;
  defaultOptions?: ValuePair[];
}

export const SaksbehandlerFilterSøk = ({ form, defaultOptions }: Props) => {
  return (
    <AsyncComboSearch
      label={'Saksbehandlere'}
      isMulti={true}
      form={form}
      name={`saksbehandlere`}
      fetcher={async (value) => clientSaksbehandlerSøk(value).then((res) => (res.type === 'SUCCESS' ? res.data : []))}
      defaultOptions={defaultOptions}
    />
  );
};
