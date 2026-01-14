import { VStack } from '@navikt/ds-react';
import { BrevdataFormFields, ValgFormField } from 'components/brevbygger/Brevbygger';
import {
  erValgtIdFritekst,
  finnBeskrivelseForAlternativ,
  finnBeskrivelseForValg,
  valgErObligatorisk,
} from 'components/brevbygger/brevmalMapping';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { SelectWrapper } from 'components/form/selectwrapper/SelectWrapper';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { Control, UseFormWatch } from 'react-hook-form';

interface ValgfeltProps {
  control: Control<BrevdataFormFields>;
  delmalIndex: number;
  valg: ValgFormField[];
  brevmal: BrevmalType;
  watch: UseFormWatch<BrevdataFormFields>;
}

const valideringsregler = (noekkel: string, brevmal: BrevmalType): Object | undefined => {
  if (valgErObligatorisk(noekkel, brevmal)) {
    return { required: 'Du må velge et alternativ' };
  }
  return undefined;
};
export const Valgfelt = ({ control, delmalIndex, valg, brevmal, watch }: ValgfeltProps) => {
  return (
    <VStack gap="4" marginBlock={'2'}>
      {valg.map((v, index) => {
        const alternativer = v.alternativer.map((alternativ) => ({
          value: alternativ.verdi,
          label: finnBeskrivelseForAlternativ(alternativ.verdi, brevmal),
        }));

        alternativer.unshift({ value: '', label: '- Velg et alternativ -' });

        const valgtAlternativ = watch(`delmaler.${delmalIndex}.valg.${index}.valgtAlternativ`);
        return (
          <div key={v.noekkel}>
            <SelectWrapper
              control={control}
              name={`delmaler.${delmalIndex}.valg.${index}.valgtAlternativ`}
              label={finnBeskrivelseForValg(v.noekkel, brevmal)}
              rules={valideringsregler(v.noekkel, brevmal)}
              key={v.noekkel}
              size={'small'}
            >
              {alternativer.map((alternativ) => (
                <option value={alternativ.value} key={alternativ.value}>
                  {alternativ.label}
                </option>
              ))}
            </SelectWrapper>
            {valgtAlternativ && erValgtIdFritekst(valgtAlternativ, brevmal) && (
              <>
                <TextAreaWrapper
                  control={control}
                  name={`delmaler.${delmalIndex}.valg.${index}.fritekst`}
                  label="Fritekst"
                  size={'small'}
                />
              </>
            )}
          </div>
        );
      })}
    </VStack>
  );
};
