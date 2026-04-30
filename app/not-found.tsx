'use client';

import { Box, Heading, Page, VStack } from '@navikt/ds-react';
import { MinusIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

//404 Page
const NotFound = () => {
  return (
    <Page>
      <Page.Block width="md" gutters>
        <Box marginBlock="space-32" padding="space-16">
          <VStack gap="space-16" marginBlock="space-32">
            <Heading level="2" size="large">
              Denne siden finnes ikke
            </Heading>

            <MinusIcon />

            <Link href="/">Gå til forsiden</Link>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default NotFound;
