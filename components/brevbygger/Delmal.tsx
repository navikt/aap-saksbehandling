import { Box, Heading, HStack, Switch } from '@navikt/ds-react';
import { BrevdataFormFields } from 'components/brevbygger/Brevbygger';
import {
  delmalErObligatorisk,
  delmalHarAlternativer,
  finnBeskrivelseForDelmal,
} from 'components/brevbygger/brevmalMapping';
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
        return (
          <Switch onChange={field.onChange} checked={field.value} hideLabel size={'small'} position="right">
            Inkluder i brev
          </Switch>
        );
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
  const harValgtDelmal = watch(`delmaler.${index}.valgt`) === true;
  const visAlternativer =
    harValgtDelmal ||
    (delmalErObligatorisk(delmalFelt.noekkel, brevmal) && delmalHarAlternativer(delmalFelt.noekkel, brevmal));

  return (
    <Box borderWidth="1" borderRadius={'12'} padding={'2'} borderColor="border-divider" background="bg-default">
      <HStack justify={'space-between'}>
        <Heading level="2" size={'small'}>
          {finnBeskrivelseForDelmal(delmalFelt.noekkel, brevmal)}
        </Heading>
        <Delmalvelger
          control={control}
          index={index}
          obligatorisk={delmalErObligatorisk(delmalFelt.noekkel, brevmal)}
        />
      </HStack>
      {visAlternativer && !!delmalFelt.valg?.length && (
        <Valgfelt valg={delmalFelt.valg} control={control} delmalIndex={index} brevmal={brevmal} watch={watch} />
      )}
    </Box>
  );
};
