'use client';

import { BodyShort, Box, Heading, Page, VStack } from '@navikt/ds-react';
import { MinusIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

//404 Page
const NotFound = () => {
  return (
    <Page>
      <Page.Block width="md" gutters>
        <Box marginBlock="8" padding="4">
          <VStack align="center" gap="4" marginBlock="8" justify="center">
            <Heading level="2" size="medium">
              Denne siden finnes ikke
            </Heading>

            <MinusIcon />

            <BodyShort textColor="subtle" align="center">
              <Link href="/">Gå til forsiden</Link>
            </BodyShort>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default NotFound;
