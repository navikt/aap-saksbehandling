import { Heading, VStack } from '@navikt/ds-react';
import { MeldekortTabell } from 'components/saksoversikt/meldekortoversikt/meldekorttabell/MeldekortTabell';

export const MeldekortOversikt = () => {
  return (
    <VStack gap={"space-16"}>
      <Heading size="medium">Meldekort</Heading>
      <MeldekortTabell />
    </VStack>
  );
};
