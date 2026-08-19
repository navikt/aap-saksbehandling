import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';

async function postMeldekort(saksid: string) {
  const reqBody = {
    saksnummer: saksid,
    referanse: {
      type: 'JOURNALPOST',
      verdi: new Date().getTime(),
    },
    type: 'LEGEERKLÆRING',
    kanal: 'DIGITAL',
    mottattTidspunkt: new Date().toISOString(),
    melding: null,
  };
  await clientSendHendelse(saksid, reqBody);
}

export function DummyLegeerklæring({ saksid }: { saksid: string }) {
  return (
    <div>
      <form
        onSubmit={(e) => {
          postMeldekort(saksid);
          e.preventDefault();
        }}
      >
        <Button>Fake mottatt legeerklæring</Button>
      </form>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
}
