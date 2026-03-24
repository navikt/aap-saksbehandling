'use client';

import { BodyShort, Box, Heading, HGrid, Label, Link, Page, VStack } from '@navikt/ds-react';
import { useParams, usePathname } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { useEffect } from 'react';
import { logClientError } from 'lib/actions/actions';

interface Props {
  error: Error & { digest?: string };
}

//500 Page
const Error = ({ error }: Props) => {
  const { saksnummer, behandlingsReferanse } = useParams<{ saksnummer?: string; behandlingsReferanse: string }>();
  const pathname = usePathname();

  useEffect(() => {
    try {
      // noinspection JSIgnoredPromiseFromCall
      logClientError({
        name: error.name,
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        saksnummer: saksnummer,
        behandlingsReferanse,
        pathname,
      });
    } catch {
      // do nothing
    }
  }, [error, saksnummer, behandlingsReferanse, pathname]);

  return (
    <Page>
      <Page.Block width="md" gutters>
        <Box marginBlock="8" padding="4">
          <VStack gap="4" marginBlock="8">
            <Heading level="2" size="large">
              En feil har oppstått!
            </Heading>

            <BodyShort>
              Du kan prøve igjen. Dersom feilen vedvarer kan du melde problemet i Porten med skjermbilde av denne siden.
            </BodyShort>

            <HGrid columns={2} gap="2">
              {saksnummer && (
                <>
                  <Label>Saksnummer:</Label>
                  <BodyShort>{saksnummer}</BodyShort>
                </>
              )}

              {behandlingsReferanse && (
                <>
                  <Label>Behandlingsreferanse:</Label>
                  <BodyShort>{behandlingsReferanse}</BodyShort>
                </>
              )}

              <Label>Tidspunkt:</Label>
              <BodyShort>{formaterDatoMedTidspunktForFrontend(new Date())}</BodyShort>

              <Label>Feilmelding:</Label>
              <BodyShort spacing>{error.message}</BodyShort>
            </HGrid>

            <Link href={'/oppgave'}>Gå til oppgavelisten</Link>
          </VStack>
        </Box>
      </Page.Block>
    </Page>
  );
};

export default Error;
