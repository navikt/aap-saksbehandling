'use client';

import { BodyShort, Box, Heading, HGrid, Label, Link, Page, VStack } from '@navikt/ds-react';
import { useParams, usePathname } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { useEffect } from 'react';
import { logClientError } from 'lib/actions/actions';
import StackTrace from 'stacktrace-js';

interface Props {
  error: Error & { digest?: string };
}

async function mapStacktrace(error?: Error): Promise<string | undefined> {
  try {
    if (!error?.stack) return undefined;
    const frames = await StackTrace.fromError(error);
    return frames.map((frame) => frame.toString()).join('\n');
  } catch {
    // behold original stack ved error
    return error?.stack;
  }
}

//500 Page
const Error = ({ error }: Props) => {
  const { saksId, behandlingsReferanse } = useParams<{ saksId?: string; behandlingsReferanse: string }>();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const stack = await mapStacktrace(error);

      try {
        // noinspection JSIgnoredPromiseFromCall
        logClientError({
          name: error.name,
          message: error.message,
          stack,
          digest: error.digest,
          saksnummer: saksId,
          behandlingsReferanse,
          pathname,
        });
      } catch {
        // do nothing
      }
    })();
  }, [error, saksId, behandlingsReferanse, pathname]);

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
              {saksId && (
                <>
                  <Label>Saksnummer:</Label>
                  <BodyShort>{saksId}</BodyShort>
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
