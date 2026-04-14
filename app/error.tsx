'use client';

import { BodyShort, Box, Heading, HGrid, Label, Link, Page, VStack } from '@navikt/ds-react';
import { useParams, usePathname } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';
import { useEffect } from 'react';
import { logClientError } from 'lib/actions/actions';
import { erIngenTilgangError } from 'lib/utils/ingenTilgang';

interface Props {
  error: Error & { digest?: string };
}

const Error = ({ error }: Props) => {
  const { saksnummer, behandlingsreferanse } = useParams<{ saksnummer?: string; behandlingsreferanse: string }>();
  const pathname = usePathname();

  const ingenTilgang = erIngenTilgangError(error);

  useEffect(() => {
    if (ingenTilgang) return; // unngå å logge tilgangsfeil som "vanlige" feil

    try {
      // noinspection JSIgnoredPromiseFromCall
      logClientError({
        name: error.name,
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        saksnummer: saksnummer,
        behandlingsReferanse: behandlingsreferanse,
        pathname,
      });
    } catch {
      // do nothing
    }
  }, [error, saksnummer, behandlingsreferanse, pathname, ingenTilgang]);

  if (ingenTilgang) {
    return <IngenTilgangFeil saksnummer={saksnummer} />;
  }

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

              {behandlingsreferanse && (
                <>
                  <Label>Behandlingsreferanse:</Label>
                  <BodyShort>{behandlingsreferanse}</BodyShort>
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

/*
 * Midlertidig løsning mens vi venter på at NextJS sin forbidden() funksjon kommer ut av "experimental" state
 */
const IngenTilgangFeil = ({ saksnummer }: { saksnummer?: string }) => (
  <VStack align="center">
    <Box marginBlock="8" padding="4">
      <VStack gap="4" marginBlock="8">
        <Heading level="2" size="large">
          Mangler tilgang
        </Heading>

        {saksnummer ? (
          <BodyShort>Du har ikke tilgang til sak {saksnummer}.</BodyShort>
        ) : (
          <BodyShort>Du har ikke tilgang til denne ressursen.</BodyShort>
        )}

        <Link href={`/`}>Gå tilbake til oppgavelisten</Link>
      </VStack>
    </Box>
  </VStack>
);

export default Error;
