'use client';

import { BodyShort, Box, Heading, Link, Page, VStack } from '@navikt/ds-react';
import { useParams } from 'next/navigation';

const SakIkkeFunnet = () => {
  const { saksId } = useParams<{ saksId: string }>();

  return (
    <Page>
      <Page.Block width="md">
        <Box marginBlock="8" padding="4">
          <VStack gap="4" marginBlock="8">
            <Heading level="2" size="large">
              {saksId ? `Fant ikke sak med saksnummer '${saksId}'` : 'Fant ikke saken'}
            </Heading>

            <BodyShort textColor="subtle">
              Dersom du mener dette er en feil kan du melde det i Porten med skjermbilde av denne siden.
            </BodyShort>

            <Link href={`/`}>Gå tilbake til oppgavelisten</Link>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default SakIkkeFunnet;
