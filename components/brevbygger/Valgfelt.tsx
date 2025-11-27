import { VStack } from '@navikt/ds-react';
import { BrevdataFormFields, ValgFormField } from 'components/brevbygger/Brevbygger';
import { finnBeskrivelseForAlternativ, finnBeskrivelseForValg } from 'components/brevbygger/brevmalMapping';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { Control } from 'react-hook-form';

interface ValgfeltProps {
  control: Control<BrevdataFormFields>;
  delmalIndex: number;
  valg: ValgFormField[];
  brevmal: BrevmalType;
}

export const Valgfelt = ({ control, delmalIndex, valg, brevmal }: ValgfeltProps) => {
  return (
    <VStack gap="2">
      {valg.map((v, index) => {
        const alternativer = v.alternativer.map((alternativ) => ({
          value: alternativ.verdi,
          label: finnBeskrivelseForAlternativ(alternativ.verdi, brevmal),
        }));

        alternativer.unshift({ value: '', label: '' });
        return (
          <SelectWrapper
            control={control}
            name={`delmaler.${delmalIndex}.valg.${index}.valgtAlternativ`}
            label={finnBeskrivelseForValg(v.noekkel, brevmal)}
            rules={{ required: 'Du må velge et alternativ' }}
            key={v.noekkel}
          >
            {alternativer.map((alternativ) => (
              <option value={alternativ.value} key={alternativ.value}>
                {alternativ.label}
              </option>
            ))}
          </SelectWrapper>
        );
      })}
    </VStack>
  );
};
