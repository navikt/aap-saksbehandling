import { BodyShort, Label, VStack } from '@navikt/ds-react';

type SpørsmålOgSvarProps = {
  spørsmål: string;
  svar: string;
};

export const SpørsmålOgSvar = ({ spørsmål, svar }: SpørsmålOgSvarProps) => (
  <VStack gap="space-4">
    <Label size="small">{spørsmål}</Label>
    <BodyShort size="small">{svar}</BodyShort>
  </VStack>
);
