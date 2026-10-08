import { TasklistIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Detail, HStack, VStack } from '@navikt/ds-react';
import { StønadsperiodeVurdering } from 'lib/types/types';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  vurdering: StønadsperiodeVurdering;
  onLukk: () => void;
}

export const StønadsperiodeBoks = ({ vurdering, onLukk }: Props) => {
  return (
    <Box borderWidth="1" borderRadius="12" borderColor="neutral-subtle">
      <Box padding="space-8" background="neutral-moderate" borderRadius="12 12 0 0">
        <HStack align="center" justify="space-between" gap="space-12" padding="space-8">
          <HStack align="center" gap="space-12">
            <TasklistIcon aria-hidden fontSize="2rem" />
            <VStack>
              <Detail>Søknadsdato: {formaterDatoForFrontend(vurdering.startDato)}</Detail>
              <BodyShort weight="semibold" size="small">
                Vurder krav {vurdering.referanse}
              </BodyShort>
            </VStack>
          </HStack>
        </HStack>
      </Box>
      <Box padding="space-16">
        <VStack gap="space-16">
          <HStack justify="space-between">
            <BodyShort>Under utvikling</BodyShort>
            <Button type="button" size="small" variant="tertiary" onClick={onLukk}>
              Lukk
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};
