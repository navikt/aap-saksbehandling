import { Box, Heading, VStack } from "@navikt/ds-react";
import { DummyMeldekort } from "components/devtools/DummyMeldekort";
import { SendNySoknad } from "components/devtools/SendNySoknad";

export const SakDevTools = ({ saksId }: { saksId: string }) => (
  <Box
    background="bg-subtle"
    padding="4"
    borderWidth="1"
    borderRadius="large"
    borderColor="border-divider"
  >
    <VStack gap="4">
      <Heading size={'medium'}>Utviklerverktøy</Heading>

      <Heading size={'xsmall'}>Send et meldekort for inneværende mnd</Heading>

      <DummyMeldekort saksid={saksId} />
      <SendNySoknad saksid={saksId} />
    </VStack>
  </Box>
)
