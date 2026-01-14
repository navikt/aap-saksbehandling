'use client';

import { Alert, BodyShort, Box, Button, Page, VStack } from '@navikt/ds-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const SakIkkeFunnet = () => {
  const { saksId } = useParams<{ saksId: string }>();

  return (
    <Page>
      <Page.Block width="md">
        <Box marginBlock="8">
          <VStack align="center" gap="4" marginBlock="8" justify="center">
            <Alert variant="warning">{saksId ? `Fant ikke sak med saksnummer '${saksId}'` : 'Fant ikke saken'}</Alert>

            <BodyShort textColor="subtle" align="center">
              Dersom du mener dette er en feil kan du melde det i Porten med skjermbilde av denne siden.
            </BodyShort>

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
