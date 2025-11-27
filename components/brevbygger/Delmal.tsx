import { Box, Heading, Switch } from '@navikt/ds-react';
import { BrevdataFormFields } from 'components/brevbygger/Brevbygger';
import { delmalErObligatorisk, finnBeskrivelseForDelmal } from 'components/brevbygger/brevmalMapping';
import { BrevmalType } from 'components/brevbygger/brevmodellTypes';
import { Valgfelt } from 'components/brevbygger/Valgfelt';
import { Control, Controller, FieldArrayWithId, UseFormWatch } from 'react-hook-form';

interface DelmalvelgerProps {
  index: number;
  control: Control<BrevdataFormFields>;
  obligatorisk: boolean;
}

const Delmalvelger = ({ index, control, obligatorisk }: DelmalvelgerProps) => {
  if (obligatorisk) {
    return null;
  }
  return (
    <Controller
      name={`delmaler.${index}.valgt`}
      control={control}
      render={({ field }) => {
        return <Switch onChange={field.onChange}>Inkluder i brev</Switch>;
      }}
    />
  );
};

interface DelmalProps {
  delmalFelt: FieldArrayWithId<BrevdataFormFields, 'delmaler'>;
  index: number;
  control: Control<BrevdataFormFields>;
  watch: UseFormWatch<BrevdataFormFields>;
  brevmal: BrevmalType;
}

export const Delmal = ({ delmalFelt, index, control, watch, brevmal }: DelmalProps) => {
  return (
    <Box borderWidth="1" borderRadius={'8'} padding={'2'} margin={'2'}>
      <Heading level="2" size={'small'}>
        {finnBeskrivelseForDelmal(delmalFelt.noekkel, brevmal)}
      </Heading>
      <Delmalvelger control={control} index={index} obligatorisk={delmalErObligatorisk(delmalFelt.noekkel, brevmal)} />
      {watch(`delmaler.${index}.valgt`) === true && delmalFelt.valg?.length && (
        <Valgfelt valg={delmalFelt.valg} control={control} delmalIndex={index} brevmal={brevmal} />
      )}
    </Box>
  );
};
