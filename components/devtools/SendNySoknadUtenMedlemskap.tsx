import { BodyShort, Button } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';

export const SendNySoknadUtenMedlemskap = ({ saksid }: { saksid: string }) => {
  const reqBody: Parameters<typeof clientSendHendelse>[1] = {
    kanal: 'DIGITAL',
    melding: {
      meldingType: 'SøknadV0',
      oppgitteBarn: {
        barn: [
          { navn: 'Jørgen Hatt Emaker', fødselsdato: '2021-03-07', relasjon: 'FORELDER' },
          {
            navn: 'Jonas Li Ibux',
            fødselsdato: '2023-03-07',
            relasjon: 'FORELDER',
          },
          { navn: 'Embla Bakke Li', fødselsdato: '2024-03-07', relasjon: 'FORELDER' },
        ],
        identer: [],
      },
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
        harBoddINorgeSiste5År: 'Nei',
        harArbeidetINorgeSiste5År: 'Ja',
        iTilleggArbeidUtenforNorge: 'Ja',
        utenlandsOpphold: [
          {
            land: 'AI:Anguilla',
            fraDato: '2014-02-11T11:30:30.000Z',
            tilDato: '2025-01-31T23:00:00.000Z',
            utenlandsId: 'e98ae04c-9443-45fe-8c4f-702055df6800',
          },
        ],
      },
      yrkesskade: 'Nei',
      student: { erStudent: 'Nei' },
      andreUtbetalinger: { lønn: 'Nei', stønad: ['NEI'], afp: {} },
    },
    mottattTidspunkt: new Date().toISOString(),
    referanse: {
      type: 'JOURNALPOST',
      verdi: new Date().toUTCString(),
    },
    saksnummer: saksid,
    type: 'SØKNAD',
  };
  return (
    <div>
      <Button onClick={() => clientSendHendelse(saksid, reqBody)}>Resend søknad uten medlemskap</Button>
      <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
    </div>
  );
};
