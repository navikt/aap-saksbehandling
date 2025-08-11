'use client';

import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { BehandlingsTyperOption, behandlingsTyperOptions } from 'lib/utils/behandlingstyper';
import { useProduksjonsstyringFilter } from 'hooks/produksjonsstyring/ProduksjonsstyringFilterHook';

export const FilterSamling = () => {
  const { filter, setFilter } = useProduksjonsstyringFilter();

  async function onToggleSelected(value: BehandlingsTyperOption[]) {
    setFilter({ ...filter, behandlingstyper: value });
  }

  return (
    <CheckboxGroup legend={'Behandlingstype'} onChange={onToggleSelected} value={filter.behandlingstyper}>
      {behandlingsTyperOptions.map((option) => (
        <Checkbox value={option} key={option} size={'small'}>
          {option}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};
