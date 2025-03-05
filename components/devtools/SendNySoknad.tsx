import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from "lib/clientApi";

export const SendNySoknad = ({ saksid }: { saksid: string }) => {
  async function postSoknad() {
    const reqBody = {
      kanal: 'DIGITAL',
      melding: {
        vedlegg: {},
        barn: [],
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
        søknadBekreft: true,
        version: 1,
        etterspurtDokumentasjon: [],
      },
      mottattTidspunkt: new Date().toISOString(),
      referanse: {
        type: 'JOURNALPOST',
        verdi: new Date().toUTCString(),
      },
      saksnummer: saksid,
      type: 'SØKNAD',
    };
    await clientSendHendelse(reqBody);
  }

  return (
    <div>
      <Button onClick={postSoknad}>Resend en enkel søknad</Button>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
};
