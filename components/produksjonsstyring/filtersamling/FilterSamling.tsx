'use client';

import { HStack, Label, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { BehandlingsTyperOption, behandlingsTyperOptions } from 'lib/utils/behandlingstyper';
import { useContext, useEffect, useState } from 'react';
import { AlleFiltereDispatchContext } from 'components/produksjonsstyring/allefiltereprovider/AlleFiltereProvider';
// import { AlleFiltereDispatchContext } from 'components/allefiltereprovider/AlleFiltereProvider';

export interface AlleFiltere {
  behandlingstyper: BehandlingsTyperOption[];
}
export const FilterSamling = () => {
  const [selectedOptions, setSelectedOptions] = useState<BehandlingsTyperOption[]>(behandlingsTyperOptions);
  const filterDispatch = useContext(AlleFiltereDispatchContext);
  useEffect(() => {
    filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { behandlingstyper: behandlingsTyperOptions } });
  }, []);
  async function onToggleSelected(option: string, isSelected: boolean) {
    if (isSelected) {
      const newSelected = [...selectedOptions, option as BehandlingsTyperOption];
      setSelectedOptions(newSelected);
      filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { behandlingstyper: newSelected } });
    } else {
      const newSelected = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(newSelected);
      filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { behandlingstyper: newSelected } });
    }
  }
  return (
    <VStack padding={'5'} gap={'5'}>
      <Label>Filtere</Label>
      <HStack>
        <UNSAFE_Combobox
          label={'Type behandling'}
          options={behandlingsTyperOptions}
          size={'small'}
          isMultiSelect
          onToggleSelected={onToggleSelected}
          selectedOptions={selectedOptions}
        />
      </HStack>
    </VStack>
  );
};
