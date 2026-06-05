import { Box, HGrid, Label } from '@navikt/ds-react';
import { PadlockLockedIcon } from '@navikt/aksel-icons';

export const StandardtekstBoks = () => (
  <Box borderWidth="1" borderRadius="12" paddingInline="space-16" paddingBlock="space-8" borderColor="neutral-subtle">
    <HGrid columns={'auto 1fr'} gap={'space-2'}>
      <PadlockLockedIcon aria-label="Låst seksjon" fontSize="1.5rem" />
      <Label size="small" style={{ opacity: '0.45' }}>
        Dette er standardtekst og kan ikke endres.
      </Label>
    </HGrid>
  </Box>
);
