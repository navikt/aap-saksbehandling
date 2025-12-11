'use client';

import { Alert, BodyLong, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';

export const SamordningBarnepensjon = () => {
  return (
    <VilkårsKort heading="§ 11-27 Samordning barnepensjon (valgfritt)" steg="SAMORDNING_BARNEPENSJON">
      {
        <VStack gap={'6'}>
          <BodyLong>
            <Alert variant={'info'}>
              Samordning med barnepensjon er ikke støttet. Hvis brukeren har barnepensjon må du sette behandlingen på
              vent og melde behovet i porten
            </Alert>
          </BodyLong>
        </VStack>
      }
    </VilkårsKort>
  );
};
