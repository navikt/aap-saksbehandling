'use client';

import { Alert, Box, Button, Page, VStack } from '@navikt/ds-react';
import Link from 'next/link';

const SakIkkeFunnet = () => {
  return (
    <Page>
      <Page.Block width="md">
        <Box marginBlock="8">
          <VStack align="center" gap="4" marginBlock="8" justify="center">
            <Alert variant="warning">Saken finnes ikke</Alert>

            <Button as={Link} variant="tertiary" size="small" href={`/`}>
              Gå tilbake til oppgavelisten
            </Button>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default SakIkkeFunnet;
