import { BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { clientKanDistribuereBrevV2 } from 'lib/clientApi';
import { isError } from 'lib/utils/api';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'components/alert/Alert';

interface Props {
  readOnly: boolean;
  referanse: string;
  mottakerId: string;
}

enum DistribusjonssjekkStatus {
  OK = 'OK',
  KAN_IKKE_DISTRIBUERE = 'KAN_IKKE_DISTRIBUERE',
}

export const Distribusjonssjekk = ({ readOnly, referanse, mottakerId }: Props) => {
  const [distribusjonssjekkFeil, setDistribusjonssjekkFeil] = useState<string | undefined>();
  const [distribusjonStatus, setdistribusjonStatus] = useState<DistribusjonssjekkStatus>();
  const [proeverIgjen, setProeverIgjen] = useState(false);

  const kanDistribuereBrevRequest = useCallback(async () => {
    if (mottakerId) {
      const response = await clientKanDistribuereBrevV2(referanse, { mottakerId });

      if (isError(response)) {
        setDistribusjonssjekkFeil(response.apiException.message);
      } else {
        setDistribusjonssjekkFeil(undefined);
        const kanDistribuereTilAlleMottakere = response.data;
        setdistribusjonStatus(
          kanDistribuereTilAlleMottakere ? DistribusjonssjekkStatus.OK : DistribusjonssjekkStatus.KAN_IKKE_DISTRIBUERE
        );
      }
    }
  }, [mottakerId, referanse, setDistribusjonssjekkFeil]);

  useEffect(() => {
    if (!readOnly) {
      kanDistribuereBrevRequest();
    }
  }, [kanDistribuereBrevRequest, readOnly]);

  const rekjørDistribuerBrevSjekk = async () => {
    setProeverIgjen(true);
    await kanDistribuereBrevRequest();
    setProeverIgjen(false);
  };

  return (
    <>
      {distribusjonStatus === DistribusjonssjekkStatus.OK && (
        <Alert
          variant={'success'}
          size="small"
          title="Brevet vil bli automatisk distribuert til mottakeren sin registrerte adresse"
        >
          Automatisk distribusjon
        </Alert>
      )}
      {distribusjonStatus === DistribusjonssjekkStatus.KAN_IKKE_DISTRIBUERE && (
        <Alert variant={'warning'} size="small">
          Brevet kan ikke distribueres automatisk til denne mottakeren. Skriv inn adresse manuelt.
        </Alert>
      )}
      {distribusjonssjekkFeil && (
        <Alert variant="error" size="small">
          <Heading level={'3'} size="small">
            Det har oppstått en feil
          </Heading>
          <VStack space-between justify={'start'}>
            <BodyShort>
              Vi kunne ikke avgjøre om brevet kan sendes til mottakeren nå. Vent noen minutter, og trykk på knappen
              under for å prøve på nytt. Ta kontakt med brukerstøtte hvis feilen vedvarer.
            </BodyShort>
            <Button
              data-color="neutral"
              onClick={() => rekjørDistribuerBrevSjekk()}
              size="small"
              variant="secondary"
              loading={proeverIgjen}
            >
              Prøv igjen
            </Button>
          </VStack>
        </Alert>
      )}
    </>
  );
};
