import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { clientKanDistribuereBrev } from 'lib/clientApi';
import { Mottaker } from 'lib/types/types';
import { isError } from 'lib/utils/api';
import { Dispatch, useCallback, useEffect, useState } from 'react';

interface Props {
  readOnly: boolean;
  referanse: string;
  valgteMottakere: Mottaker[];
  distribusjonssjekkFeil: string | undefined;
  setDistribusjonssjekkFeil: Dispatch<string | undefined>;
  brukerMottaker?: Mottaker;
}

export const Distribusjonssjekk = ({
  readOnly,
  referanse,
  valgteMottakere,
  brukerMottaker,
  distribusjonssjekkFeil,
  setDistribusjonssjekkFeil,
}: Props) => {
  const [visKanIkkeDistribuereAdvarsel, setVisKanIkkeDistribuereAdvarsel] = useState(false);
  const [proeverIgjen, setProeverIgjen] = useState(false);

  const kanDistribuereBrevRequest = useCallback(async () => {
    const brukerIdent = brukerMottaker?.ident;

    if (brukerIdent) {
      const valgteMottakereIdentListe = valgteMottakere
        .map((mottaker) => mottaker.ident)
        .filter((ident) => typeof ident === 'string');

      const mottakerIdentListe = valgteMottakereIdentListe.length > 0 ? valgteMottakereIdentListe : [brukerIdent];

      const response = await clientKanDistribuereBrev(referanse, {
        brukerIdent,
        mottakerIdentListe,
      });

      if (isError(response)) {
        setDistribusjonssjekkFeil(response.apiException.message);
      } else {
        setDistribusjonssjekkFeil(undefined);
        const kanDistribuereTilAlleMottakere = !response.data.mottakereDistStatus.some(
          (distStatus: { mottakerIdent: String; kanDistribuere: boolean }) => !distStatus.kanDistribuere
        );
        setVisKanIkkeDistribuereAdvarsel(!kanDistribuereTilAlleMottakere);
      }
    }
  }, [brukerMottaker?.ident, referanse, valgteMottakere, setDistribusjonssjekkFeil]);

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
      {visKanIkkeDistribuereAdvarsel && (
        <Alert variant={'warning'} size={'small'} className={'fit-content'}>
          Brevet kan ikke distribueres til alle mottakere. Se rutinebeskrivelse for manuell håndtering.
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
              onClick={() => rekjørDistribuerBrevSjekk()}
              size="small"
              variant="secondary-neutral"
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
