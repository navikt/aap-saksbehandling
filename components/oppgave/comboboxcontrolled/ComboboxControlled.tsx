'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import { UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';

interface Props {
  label: string;
  options: ComboboxOption[];
  selectedOptions: ComboboxOption[];
  setSelectedOptions: Dispatch<SetStateAction<ComboboxOption[]>>;
}
export const ComboboxControlled = ({ options, label, selectedOptions, setSelectedOptions }: Props) => {
  const [value, setValue] = useState('');

  const onToggleSelected = (option: string, isSelected: boolean) => {
    const fullOption = options.find((e) => e.value === option);
    if (isSelected) {
      if (fullOption) {
        setSelectedOptions([...selectedOptions, fullOption]);
      }
    } else {
      const newList = selectedOptions.filter((o) => o.value !== option);
      setSelectedOptions(newList);
    }
  };

  return (
    <UNSAFE_Combobox
      label={label}
      isMultiSelect
      onChange={setValue}
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedOptions}
      options={options}
      value={value}
      size={'small'}
    />
  );
};
