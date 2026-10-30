import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';

export const SendNySoknad = ({ saksid }: { saksid: string }) => {
  async function postSoknad() {
    const reqBody: Parameters<typeof clientSendHendelse>[1] = {
      kanal: 'DIGITAL',
      melding: {
        meldingType: 'SøknadV0',
        oppgitteBarn: { barn: [], identer: [] },
        fastlege: [
          {
            navn: 'Sonja Paracet Plastersen',
            behandlerRef: 'd182f24b-ebca-4f44-bf86-65901ec6141b',
            kontaktinformasjon: {
              kontor: 'Andeby legekontor',
              adresse: 'Skogveien 17, 1234 Andeby',
              telefon: '99999999',
            },
            erRegistrertFastlegeRiktig: 'Ja',
          },
        ],
        sykepenger: 'Nei',
        medlemskap: {
          harBoddINorgeSiste5År: 'Ja',
          arbeidetUtenforNorgeFørSykdom: 'Nei',
        },
        yrkesskade: 'Nei',
        student: {
          erStudent: 'Nei',
        },
        andreUtbetalinger: {
          lønn: 'Nei',
          stønad: ['NEI'],
          afp: {},
        },
      },
      mottattTidspunkt: new Date().toISOString(),
      referanse: {
        type: 'JOURNALPOST',
        verdi: new Date().toUTCString(),
      },
      saksnummer: saksid,
      type: 'SØKNAD',
    };
    await clientSendHendelse(saksid, reqBody);
  }

  return (
    <div>
      <Button onClick={postSoknad}>Resend en enkel søknad</Button>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
};
