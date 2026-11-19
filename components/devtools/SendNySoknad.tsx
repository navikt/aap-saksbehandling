import { BodyShort, Button, VStack } from '@navikt/ds-react';
import { clientSendHendelse } from 'lib/clientApi';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { validerDato } from 'lib/validation/dateValidation';

interface FormFields {
  mottattDato: string;
}

export const SendNySoknad = ({ saksid }: { saksid: string }) => {
  const { form, formFields } = useConfigForm<FormFields>({
    mottattDato: {
      type: 'date_input',
      label: 'Mottatt dato',
      defaultValue: formaterDatoForFrontend(new Date()),
      rules: {
        required: 'Du må oppgi en dato',
        validate: (v) => validerDato(v),
      },
    },
  });

  async function postSoknad(data: FormFields) {
    const mottatt = parseDatoFraDatePicker(data.mottattDato) ?? new Date();
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
      mottattTidspunkt: mottatt.toISOString(),
      referanse: {
        type: 'JOURNALPOST',
        verdi: crypto.randomUUID(),
      },
      saksnummer: saksid,
      type: 'SØKNAD',
    };
    await clientSendHendelse(saksid, reqBody);
  }

  return (
    <form onSubmit={form.handleSubmit(postSoknad)}>
      <VStack gap={'space-8'} align={'start'}>
        <FormField form={form} formField={formFields.mottattDato} />
        <Button type={'submit'}>Resend en enkel søknad</Button>
        <BodyShort size={'small'}>(Refresh siden for å se om det gikk bra)</BodyShort>
      </VStack>
    </form>
  );
};
