'use client';

import { HStack, UNSAFE_Combobox, VStack } from '@navikt/ds-react';
import { useContext, useEffect, useState } from 'react';
import { OppgaveAvklaringsbehovKode } from 'lib/types/oppgaveTypes';
import { oppgaveAvklaringsbehov } from '../../../lib/utils/avklaringsbehov';
import { OppgaveAlleFiltereDispatchContext } from '../oppgaveallefiltereprovider/OppgaveAlleFiltereProvider';

export interface OppgaveAlleFiltere {
  oppgaveTyper: OppgaveAvklaringsbehovKode[];
}
export const OppgaveFilterSamling = () => {
  const oppgaveOptions: OppgaveAvklaringsbehovKode[] = Object.keys(
    oppgaveAvklaringsbehov
  ) as OppgaveAvklaringsbehovKode[];

  const [selectedOptions, setSelectedOptions] = useState<OppgaveAvklaringsbehovKode[]>();
  const filterDispatch = useContext(OppgaveAlleFiltereDispatchContext);

  useEffect(() => {
    filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { oppgaveTyper: oppgaveOptions } });
  }, []);
  async function onToggleSelected(option: string, isSelected: boolean) {
    if (isSelected) {
      // @ts-ignore
      const newSelected = [...selectedOptions, option as OppgaveAvklaringsbehovKode];
      setSelectedOptions(newSelected);
      filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { oppgaveTyper: newSelected } });
    } else {
      // @ts-ignore
      const newSelected = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(newSelected);
      filterDispatch && filterDispatch({ type: 'SET_FILTERE', payload: { oppgaveTyper: newSelected } });
    }
  }
  return (
    <VStack padding={'5'} gap={'5'}>
      <HStack>
        <UNSAFE_Combobox
          label={'Filtrer på oppgavetype'}
          options={oppgaveOptions}
          size={'small'}
          isMultiSelect
          onToggleSelected={onToggleSelected}
          selectedOptions={selectedOptions}
        />
      </HStack>
    </VStack>
  );
};
