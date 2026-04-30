'use client';

import { BodyShort, Box, Heading, Link, Page, VStack } from '@navikt/ds-react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';

const SakIkkeFunnet = () => {
  const { saksnummer } = useParamsMedType();

  return (
    <Page>
      <Page.Block width="md">
        <Box marginBlock="space-32" padding="space-16">
          <VStack gap="space-16" marginBlock="space-32">
            <Heading level="2" size="large">
              {saksnummer ? `Fant ikke sak med saksnummer '${saksnummer}'` : 'Fant ikke saken'}
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
