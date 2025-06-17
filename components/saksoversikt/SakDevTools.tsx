import { Box, Heading, VStack } from '@navikt/ds-react';
import { DummyMeldekort } from 'components/devtools/DummyMeldekort';
import { SendNySoknad } from 'components/devtools/SendNySoknad';
import { SendNySoknadUtenMedlemskap } from 'components/devtools/SendNySoknadUtenMedlemskap';
import { DummyKabalEvent } from 'components/devtools/DummyKabalEvent';

export const SakDevTools = ({
  saksnummer,
  behandlinger,
}: {
  saksnummer: string;
  behandlinger: { referanse: string; type: string }[];
}) => {
  console.log(behandlinger);
  const klage = 'ae0058';
  return (
    <Box background="bg-subtle" padding="4" borderWidth="1" borderRadius="large" borderColor="border-divider">
      <VStack gap="4">
        <Heading size={'medium'}>Utviklerverktøy</Heading>

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
    </Box>
  );
};
