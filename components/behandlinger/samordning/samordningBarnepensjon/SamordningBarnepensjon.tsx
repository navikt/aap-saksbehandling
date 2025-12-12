'use client';

import { Alert, BodyLong, VStack } from '@navikt/ds-react';
import { VilkårsKort } from 'components/vilkårskort/Vilkårskort';
import { differenceInYears, isValid, parse } from 'date-fns';
import { useSak } from 'hooks/SakHook';

interface Props {
  fødselsdato: string;
}

export const SamordningBarnepensjon = ({ fødselsdato }: Props) => {
  const { sak } = useSak();

  const parseDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const parsed = parse(dateString, 'yyyy-MM-dd', new Date());
    return isValid(parsed) ? parsed : null;
  };

  const fødselsdatoAsDate = parseDate(fødselsdato);
  const startDato = parseDate(sak.periode.fom);

  if (!fødselsdatoAsDate || !startDato) return null;

  const erYngereEnn23 = differenceInYears(startDato, fødselsdatoAsDate) < 23;
  if (!erYngereEnn23) return null;

  return (
    <VilkårsKort heading="§ 11-27 Samordning barnepensjon (valgfritt)" steg="UDEFINERT">
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
