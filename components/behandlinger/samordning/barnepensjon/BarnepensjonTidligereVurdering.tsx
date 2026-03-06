import { VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';

interface Props {
  vurdering: any; // TODO Fiks riktig type fra backend når den er klar
}

export const BarnepensjonTidligereVurdering = ({ vurdering }: Props) => {
  console.log(vurdering);
  return (
    <VStack>
      <SpørsmålOgSvar spørsmål={'Periode'} svar={'sett inn korrekt svar her'} />
      <SpørsmålOgSvar spørsmål={'Månedsytelse'} svar={'sett inn korrekt svar her'} />
      <SpørsmålOgSvar spørsmål={'Dagsats'} svar={'sett inn korrekt svar her'} />
    </VStack>
  );
};
