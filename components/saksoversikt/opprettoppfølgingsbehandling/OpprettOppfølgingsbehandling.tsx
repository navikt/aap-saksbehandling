'use client';

import { Alert, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { OppfølgingsoppgaveV0, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import styles from './OpprettOppfølgingsbehandling.module.css';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForBackend } from 'lib/utils/date';
import { v4 as uuid } from 'uuid';
import { parse } from 'date-fns';

export interface OppfølgingsoppgaveFormFields {
  datoForOppfølging: string;
  hvaSkalFølgesOpp: string;
  hvemSkalFølgeOpp: string;
}

export const OpprettOppfølgingsBehandling = ({ sak }: { sak: SaksInfo }) => {
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
        reserverTilBruker: 'dd',
        hvemSkalFølgeOpp: 'NasjonalEnhet',
      } satisfies OppfølgingsoppgaveV0,
    };

    console.log(JSON.stringify(innsending));
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
    datoForOppfølging: { type: 'date_input', label: 'Dato for oppfølging', rules: { required: 'Må settes' } },
    hvemSkalFølgeOpp: {
      type: 'combobox',
      label: 'Hvem',
      options: ['Meg', 'NAY', 'Lokalkontor'],
    },
    hvaSkalFølgesOpp: {
      type: 'textarea',
      label: 'Beskrivelse av klagen',
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter oppfølgingsbehandling ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <ExpansionCard aria-label="Opprett oppfølgingsbehandling" size={'small'} defaultOpen={true}>
            <ExpansionCard.Header>
              <ExpansionCard.Title size="small">Opprett Klage</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content>
              <VStack gap="4">
                <FormField form={form} formField={formFields.datoForOppfølging} size="medium" />
                <FormField form={form} formField={formFields.hvaSkalFølgesOpp} size="medium" />
                <FormField form={form} formField={formFields.hvemSkalFølgeOpp} size="medium" />
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
