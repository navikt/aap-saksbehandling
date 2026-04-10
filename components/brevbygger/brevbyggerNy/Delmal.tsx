import { Box, Heading, HStack, Switch } from '@navikt/ds-react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DelmalReferanse, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { Valgliste } from 'components/brevbygger/brevbyggerNy/Valg';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  watch: UseFormWatch<BrevFormVerdier>;
}

export const Delmal = ({ delmalRef, control, watch }: Props) => {
  const { delmal, obligatorisk } = delmalRef;

  const valgRefs = delmal.teksteditor.filter((node): node is ValgRef => node._type === 'valgRef');
  const harValg = valgRefs.length > 0;

  if (obligatorisk && !harValg) {
    return null;
  }

  // sjekker om denne delmalen er valgt eller er obligatorisk
  const erValgt = watch(`delmaler.${delmal._id}`) || obligatorisk;

  return (
    <Box borderWidth="1" borderRadius="12" padding="2" borderColor="border-divider" background="bg-default">
      <HStack justify="space-between">
        <Heading level="2" size="small">
          {delmal.beskrivelse}
        </Heading>

        {!obligatorisk && (
          <Controller
            name={`delmaler.${delmal._id}`}
            control={control}
            render={({ field }) => (
              <Switch onChange={field.onChange} checked={field.value} hideLabel size="small" position="right">
                Inkluder i brev
              </Switch>
            )}
          />
        )}
      </HStack>

      {erValgt && <Valgliste valgRefs={valgRefs} control={control} watch={watch} />}
    </Box>
  );
};
