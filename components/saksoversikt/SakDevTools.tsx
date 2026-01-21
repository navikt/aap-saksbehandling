import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';
import { DummyMeldekort } from 'components/devtools/DummyMeldekort';
import { SendNySoknad } from 'components/devtools/SendNySoknad';
import { SendNySoknadUtenMedlemskap } from 'components/devtools/SendNySoknadUtenMedlemskap';
import { DummyKabalEvent } from 'components/devtools/DummyKabalEvent';
import { LeggTilMockInstitusjonsopphold } from 'components/devtools/LeggTilMockInstitusjonsopphold';
import { LeggTilMockYrkesskade } from 'components/devtools/LeggTilMockYrkesskade';

export const SakDevTools = ({
  saksnummer,
  behandlinger,
}: {
  saksnummer: string;
  behandlinger: { referanse: string; type: string }[];
}) => {
  const klage = 'ae0058';
  return (
    <Box background="bg-subtle" padding="4" borderWidth="1" borderRadius="large" borderColor="border-divider">
      <Heading size={'medium'}>Utviklerverktøy</Heading>

      <HGrid gap="2" columns={2}>
        <VStack gap="4">
          <Heading size={'xsmall'}>Send et meldekort for inneværende mnd</Heading>

          <DummyMeldekort saksid={saksnummer} />
          <SendNySoknad saksid={saksnummer} />
          <SendNySoknadUtenMedlemskap saksid={saksnummer} />

          {behandlinger && (
            <DummyKabalEvent
              saksnummer={saksnummer}
              klagebehandlinger={behandlinger.filter((e) => e.type === klage).map((e) => e.referanse)}
            />
          )}
        </VStack>

        <VStack gap="4">
          <LeggTilMockInstitusjonsopphold saksnummer={saksnummer} />
          <LeggTilMockYrkesskade saksnummer={saksnummer} />
        </VStack>
      </HGrid>
    </Box>
  );
};
