'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useMemo, useState } from 'react';
import { ComboOption } from 'components/produksjonsstyring/minenhet/MineEnheter';

interface Props {
  enheter: Enhet[];
  aktiveEnheter: ComboOption[];
  setAktiveEnheter: (enheter: ComboOption[]) => void;
}

export const EnheterSelect = ({ enheter, aktiveEnheter, setAktiveEnheter }: Props) => {
  const [value, setValue] = useState('');
  const enheterOptions = enheter.map((enhet) => ({ value: enhet.enhetNr, label: enhet.navn }));

  const filteredOptions = useMemo(() => enheterOptions.filter((option) => option.label.includes(value)), [value]);
  const onToggleSelected = (option: string, isSelected: boolean) => {
    const labelAndValue: ComboOption = {
      value: option,
      label: enheterOptions.find((e) => e.value === option)?.label,
    };
    let newSelected = [];
    if (isSelected) {
      newSelected = [...aktiveEnheter, labelAndValue];
    } else {
      newSelected = aktiveEnheter.filter((o) => o.value !== option);
    }
    setAktiveEnheter(newSelected);
  };

  return (
    <UNSAFE_Combobox
      label="Velg enheter"
      size="small"
      value={value}
      filteredOptions={filteredOptions}
      isMultiSelect
      onToggleSelected={onToggleSelected}
      selectedOptions={aktiveEnheter as unknown as string[]}
      options={enheterOptions}
      onChange={setValue}
    />
  );
};
