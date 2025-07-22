'use client';

import { Alert, BodyLong, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { OppfølgingsoppgaveV0, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForBackend } from 'lib/utils/date';
import { v4 as uuid } from 'uuid';
import { parse } from 'date-fns';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { erDatoIFremtiden, validerDato } from 'lib/validation/dateValidation';

export interface OppfølgingsoppgaveFormFields {
  datoForOppfølging: string;
  hvaSkalFølgesOpp: string;
  hvemSkalFølgeOpp: ['NAY', 'Lokalkontor'];
  reserverTilMeg: boolean;
}

export const OpprettOppfølgingsBehandling = ({
  sak,
  brukerInformasjon,
}: {
  sak: SaksInfo;
  brukerInformasjon: BrukerInformasjon;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function sendHendelse(data: OppfølgingsoppgaveFormFields) {
    const innsending = {
      saksnummer: sak.saksnummer,
      referanse: {
        type: 'BEHANDLING_REFERANSE',
        verdi: uuid(),
      },
      type: 'OPPFØLGINGSOPPGAVE',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'OppfølgingsoppgaveV0',
        datoForOppfølging: formaterDatoForBackend(parse(data.datoForOppfølging, 'dd.MM.yyyy', new Date())),
        hvaSkalFølgesOpp: data.hvaSkalFølgesOpp,
        reserverTilBruker: data.reserverTilMeg ? brukerInformasjon.NAVident : undefined,
        hvemSkalFølgeOpp: 'NasjonalEnhet',
      } satisfies OppfølgingsoppgaveV0,
    };

    setIsLoading(true);

    const res = await clientSendHendelse(sak.saksnummer, innsending);

    if (isSuccess(res)) {
      router.push(`/saksbehandling/sak/${sak.saksnummer}`);
    } else {
      setError(res.apiException.message);
    }
    setIsLoading(false);
  }

  const { form, formFields } = useConfigForm<OppfølgingsoppgaveFormFields>({
    datoForOppfølging: {
      type: 'date_input',
      label: 'Dato for oppfølging',
      rules: {
        required: 'Dato for oppfølging kan ikke må settes.',
        validate: (value) => {
          const valideringsresultat = validerDato(value as string);
          if (valideringsresultat) {
            return valideringsresultat;
          }

          if (!erDatoIFremtiden(value as string)) {
            return 'Datoen kan ikke være tilbake i tid.';
          }
        },
      },
    },
    hvemSkalFølgeOpp: {
      type: 'combobox',
      label: 'Hvem følger opp?',
      options: [
        {
          label: 'NAY',
          value: 'NAY',
        },
        { label: 'Lokalkontor', value: 'Lokalkontor' },
      ],
      rules: { required: 'Må sette hvem som skal følge opp.' },
    },
    reserverTilMeg: {
      type: 'checkbox',
      options: [{ label: 'Reserver oppgaven til meg', value: 'RESERVER_TIL_MEG' }],
      defaultValue: ['RESERVER_TIL_MEG'],
    },
    hvaSkalFølgesOpp: {
      type: 'textarea',
      label: 'Hva skal følges opp?',
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter oppfølgingsoppgave ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <ExpansionCard aria-label="Opprett oppfølgingsoppgave" size={'small'} defaultOpen={true}>
            <ExpansionCard.Header>
              <ExpansionCard.Title size="small">Opprett oppfølgingsoppgave</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content>
              <VStack gap="4">
                <div>
                  <BodyLong>Oppfølgingsoppgaven ligger på vent til ønsket dato.</BodyLong>
                </div>
                <FormField form={form} formField={formFields.datoForOppfølging} size="medium" />
                <FormField form={form} formField={formFields.hvaSkalFølgesOpp} size="medium" />
                <FormField form={form} formField={formFields.hvemSkalFølgeOpp} size="medium" />
                <FormField form={form} formField={formFields.reserverTilMeg} size="medium" />
              </VStack>
            </ExpansionCard.Content>
          </ExpansionCard>

          {error && (
            <Alert variant={'error'} size={'small'}>
              {error}
            </Alert>
          )}

          <HStack gap="4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}`)}
            >
              Avbryt
            </Button>
            <Button type="submit">Opprett oppfølgingsbehandling</Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
