'use client';

import { BodyShort, Box, Heading, Link, Page, VStack } from '@navikt/ds-react';
import { useParams } from 'next/navigation';

const IngenTilgangSak = () => {
  const { saksnummer } = useParams<{ saksnummer: string }>();

  return (
    <Page>
      <Page.Block width="md">
        <Box marginBlock="8" padding="4">
          <VStack gap="4" marginBlock="8">
            <Heading level="2" size="large">
              Mangler tilgang
            </Heading>

            <BodyShort>Du har ikke tilgang til sak {saksnummer}.</BodyShort>

            <Link href={`/`}>Gå tilbake til oppgavelisten</Link>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default IngenTilgangSak;
