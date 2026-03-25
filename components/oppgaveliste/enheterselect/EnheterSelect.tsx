'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { Enhet } from 'lib/types/oppgaveTypes';
import { useMemo, useState } from 'react';
import { ValuePair } from 'components/form/FormField';

interface Props {
  enheter: Enhet[];
  aktiveEnheter: ValuePair[];
  setAktiveEnheter: (enheter: ValuePair[]) => void;
  className?: string;
}

export const EnheterSelect = ({ enheter, aktiveEnheter, setAktiveEnheter, className }: Props) => {
  const [value, setValue] = useState('');
  const enheterOptions = useMemo(
    () => enheter.map((enhet) => ({ value: enhet.enhetNr, label: enhet.navn })),
    [enheter]
  );

  const filteredOptions = useMemo(
    () => enheterOptions.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())),
    [value, enheterOptions]
  );
  const onToggleSelected = (option: string, isSelected: boolean) => {
    const labelAndValue: ValuePair = {
      value: option,
      label: enheterOptions.find((e) => e.value === option)?.label || '',
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
      className={className}
    />
  );
};
