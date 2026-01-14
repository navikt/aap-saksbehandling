'use client';

import { BodyShort, Box, Heading, HGrid, Label, Link, Page, VStack } from '@navikt/ds-react';
import { useParams } from 'next/navigation';
import { formaterDatoMedTidspunktForFrontend } from 'lib/utils/date';

interface Props {
  error: Error & { digest?: string };
}

//500 Page
const Error = ({ error }: Props) => {
  const { saksId } = useParams<{ saksId?: string }>();

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
