import { Alert, Button, Heading, VStack } from '@navikt/ds-react';
import { clientLeggTilYrkesskade } from 'lib/clientApi';
import { useFetch } from 'hooks/FetchHook';

export const LeggTilMockYrkesskade = ({ saksnummer }: { saksnummer: string }) => {
  const { method: leggTilYrkesskade, isLoading, error } = useFetch(clientLeggTilYrkesskade);

  const send = async () => {
    leggTilYrkesskade(saksnummer);
  };

  return (
    <VStack gap="2">
      <Heading size="small">Yrkesskade</Heading>

      <div>
        <Button onClick={send} loading={isLoading}>
          Legg til
        </Button>
        {error && <Alert variant="error">{error}</Alert>}
      </div>
    </VStack>
  );
};
