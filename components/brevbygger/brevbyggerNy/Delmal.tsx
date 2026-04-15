import { Box, Heading, HStack, Switch, VStack } from '@navikt/ds-react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { DelmalReferanse, FritekstType, ValgRef } from 'components/brevbygger/brevmodellTypes';
import { BrevFormVerdier } from 'components/brevbygger/brevbyggerNy/types';
import { Valg } from 'components/brevbygger/brevbyggerNy/Valg';
import { DelmalFritekst } from 'components/brevbygger/brevbyggerNy/Fritekst';

interface Props {
  delmalRef: DelmalReferanse;
  control: Control<BrevFormVerdier>;
  watch: UseFormWatch<BrevFormVerdier>;
}

export const Delmal = ({ delmalRef, control, watch }: Props) => {
  const { delmal, obligatorisk } = delmalRef;

  const valgOgFritekst = delmal.teksteditor.filter(
    (node): node is ValgRef | FritekstType => node._type === 'valgRef' || node._type === 'fritekst'
  );
  const harValgEllerFritekst = valgOgFritekst.length > 0;

  if (obligatorisk && !harValgEllerFritekst) {
    return null;
  }

  // sjekker om denne delmalen er valgt eller er obligatorisk
  const erValgt = watch(`delmaler.${delmal._id}`) || obligatorisk;

  return (
    <Box borderWidth="1" borderRadius="12" padding="space-8" borderColor="neutral-subtle" background="default">
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
      {erValgt && (
        <VStack gap="space-16" marginBlock="space-8">
          {valgOgFritekst.map((node) => {
            if (node._type === 'fritekst') {
              return <DelmalFritekst key={node._key} node={node} control={control} />;
            }
            return <Valg key={node._key} valgRef={node} control={control} watch={watch} />;
          })}
        </VStack>
      )}
    </Box>
  );
};
