'use client';

import { Alert, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { differenceInYears } from 'date-fns';
import { useSak } from 'hooks/SakHook';
import { stringToDate } from 'lib/utils/date';

interface Props {
  fødselsdato: string;
}

export const SamordningBarnepensjon = ({ fødselsdato }: Props) => {
  const { sak } = useSak();

  const fødselsdatoAsDate = stringToDate(fødselsdato);
  const startDato = stringToDate(sak.periode.fom);

  if (!fødselsdatoAsDate || !startDato) return null;

  const erYngereEnn23 = differenceInYears(startDato, fødselsdatoAsDate) < 23;
  if (!erYngereEnn23) return null;

  return (
    <VilkårsKort heading="§ 11-27 Samordning barnepensjon (valgfritt)" steg="UDEFINERT">
      {
        <VStack gap={'6'}>
          <Alert variant={'info'}>
            Samordning med barnepensjon er ikke støttet. Hvis brukeren har barnepensjon må du sette behandlingen på vent
            og melde behovet i porten.
          </Alert>
        </VStack>
      }
    </VilkårsKort>
  );
};
