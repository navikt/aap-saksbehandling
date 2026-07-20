import { VStack } from '@navikt/ds-react/Stack';
import { BodyShort, Label } from '@navikt/ds-react/Typography';

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
