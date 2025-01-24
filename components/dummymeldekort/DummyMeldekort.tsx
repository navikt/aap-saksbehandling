import { isLocal } from '@navikt/aap-felles-utils';
import { BodyShort, Button } from '@navikt/ds-react';
import { sendFakeMeldekort } from 'lib/services/saksbehandlingservice/saksbehandlingService';

const pad = (input: number): string => input.toString().padStart(2, '0');
const formaterDato = (dato: Date): string => `${dato.getFullYear()}-${pad(dato.getMonth() + 1)}-${pad(dato.getDate())}`;

export function DummyMeldekort({ saksid }: { saksid: string }) {
  // komponenten skal kun brukes lokalt
  if (!isLocal()) {
    return;
  }

  async function postMeldekort() {
    'use server';

    const nå = new Date();
    const mndStart = new Date(nå.getFullYear(), nå.getMonth(), 1);
    const mndSlutt = new Date(nå.getFullYear(), nå.getMonth() + 1, 0);
    const reqBody = {
      saksnummer: saksid,
      referanse: {
        type: 'JOURNALPOST',
        verdi: new Date().getTime(),
      },
      type: 'PLIKTKORT',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'PliktkortV0',
        timerArbeidPerPeriode: [
          {
            fraOgMedDato: formaterDato(mndStart),
            tilOgMedDato: formaterDato(mndSlutt),
            timerArbeid: 25.0,
          },
        ],
      },
    };
    await sendFakeMeldekort(reqBody);
  }

  return (
    <div>
      <Button onClick={postMeldekort}>Send inn et meldekort</Button>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
}
