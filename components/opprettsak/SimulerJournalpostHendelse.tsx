'use client';

import React, { useState } from 'react';
import { BodyShort, Button, HGrid, HStack, InfoCard } from '@navikt/ds-react';
import { postmottakSimulerJournalpostHendelseClient } from 'lib/postmottakClientApi';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { intervalToDuration } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { validerDato } from 'lib/validation/dateValidation';
import { Dato } from 'lib/types/Dato';
import { SimulerJournalpostHendelseRequest } from 'lib/types/postmottakTypes';

interface SimulerJournalpostHendelseFormFields {
  journalpostId: string;
  fnr: string;
  fødselsdato: string;
  tema: string;
  temaGammelt: string;
  journalpostStatus: string;
  hendelsesType: string;
  scenario: SimulerJournalpostHendelseRequest['scenario'];
}

export const SimulerJournalpostHendelse = ({ defaultFnr }: { defaultFnr?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const { formFields, form } = useConfigForm<SimulerJournalpostHendelseFormFields>({
    journalpostId: {
      type: 'text',
      label: 'JournalpostID',
      rules: {
        required: 'Du må skrive inn en journalpostID',
        validate: (value: string | boolean) => {
          if (!/^\d+$/.test(value.toString())) {
            return 'JournalpostID må være et tall';
          }
        },
      },
    },
    fnr: {
      type: 'text',
      label: 'Fødselsnummer (valgfritt, ny testperson opprettes hvis tomt)',
      defaultValue: defaultFnr,
      rules: {
        validate: (value: string | boolean) => {
          if (!value) {
            return undefined;
          }
          if (!/^\d{11}$/.test(value.toString())) {
            return 'Fødselsnummeret må være 11 siffer';
          }
        },
      },
    },
    fødselsdato: {
      type: 'date_input',
      defaultValue: '01.01.2000',
      label: 'Fødselsdato',
      rules: {
        validate: (value: string) => (value ? validerDato(value) : undefined),
      },
    },
    tema: {
      type: 'text',
      label: 'Tema (nytt)',
      defaultValue: 'AAP',
    },
    temaGammelt: {
      type: 'text',
      label: 'Tema (gammelt, kun ved temaendring)',
    },
    journalpostStatus: {
      type: 'select',
      label: 'Journalpoststatus',
      defaultValue: 'MOTTATT',
      options: ['MOTTATT', 'JOURNALFOERT', 'FERDIGSTILT', 'UTGAAR'],
    },
    hendelsesType: {
      type: 'select',
      label: 'Hendelsestype',
      defaultValue: 'JournalpostMottatt',
      options: ['JournalpostMottatt', 'TemaEndret'],
    },
    scenario: {
      type: 'select',
      label: 'Scenario (samme oppsett som TestJournalPostBuilder)',
      defaultValue: 'LEGEERKLÆRING',
      options: [
        { value: 'LEGEERKLÆRING', label: 'Legeerklæring' },
        { value: 'DIGITAL_SØKNAD', label: 'Digital søknad' },
        { value: 'PAPIRSØKNAD', label: 'Papirsøknad' },
        { value: 'ANNET_RELEVANT_DOKUMENT', label: 'Annet relevant dokument' },
        { value: 'UTENLANDSK_ORGNR', label: 'Utenlandsk orgnr (krever journalpoststatus JOURNALFOERT)' },
      ],
    },
  });

  const fødselsdato = parseDatoFraDatePicker(form.watch('fødselsdato'));
  const alder = fødselsdato ? intervalToDuration({ start: fødselsdato, end: new Date() }) : undefined;

  const handleSubmit = async (data: SimulerJournalpostHendelseFormFields) => {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await postmottakSimulerJournalpostHendelseClient({
        journalpostId: parseInt(data.journalpostId),
        fnr: data.fnr || undefined,
        fødselsdato: data.fødselsdato ? new Dato(data.fødselsdato).formaterForBackend() : undefined,
        tema: data.tema,
        temaGammelt: data.temaGammelt || undefined,
        journalpostStatus: data.journalpostStatus,
        hendelsesType: data.hendelsesType,
        scenario: data.scenario,
      });
      if (isSuccess(res)) {
        setMessage(`Journalpost ${data.journalpostId} sendt som Kafka-hendelse til postmottak`);
      } else {
        setMessage('Noe gikk galt');
      }
    } catch {
      setMessage('Noe gikk galt');
    }
    setIsLoading(false);
  };

  return (
    <>
      <InfoCard data-color="info">
        <InfoCard.Header>
          <InfoCard.Title>Postmottak må kjøre</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          Kjør TestApp i postmottak og start frontend med yarn dev:postmottak eller yarn dev:all for å kunne simulere
          journalposter.
        </InfoCard.Content>
      </InfoCard>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <HGrid columns={2} gap="space-16">
          <FormField form={form} formField={formFields.journalpostId} />
          <FormField form={form} formField={formFields.fnr} />
          <HStack gap="space-8" align="end">
            <FormField form={form} formField={formFields.fødselsdato} />
            {alder && (
              <BodyShort>
                {alder.years ?? 0} år og {alder.months ?? 0} måneder
              </BodyShort>
            )}
          </HStack>
          <FormField form={form} formField={formFields.tema} />
          <FormField form={form} formField={formFields.temaGammelt} />
          <FormField form={form} formField={formFields.journalpostStatus} />
          <FormField form={form} formField={formFields.hendelsesType} />
          <FormField form={form} formField={formFields.scenario} />
        </HGrid>

        {message && <Alert variant="info">{message}</Alert>}

        <Button className={'fit-content'} loading={isLoading}>
          Simuler journalpost-hendelse
        </Button>
      </form>
    </>
  );
};
