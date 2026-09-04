'use client';

import React, { useState } from 'react';
import { Button, HGrid } from '@navikt/ds-react';
import { postmottakSimulerJournalpostHendelseClient } from 'lib/postmottakClientApi';
import { isSuccess } from 'lib/utils/api';
import { Alert } from 'components/alert/Alert';
import { DevtoolWrapper } from 'components/devtools/DevtoolWrapper';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';

interface SimulerJournalpostHendelseFormFields {
  journalpostId: string;
  fnr: string;
  tema: string;
  temaGammelt: string;
  journalpostStatus: string;
  mottaksKanal: string;
  hendelsesType: string;
  erDigitalSøknad: boolean;
}

export const SimulerJournalpostHendelse = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const { formFields, form } = useConfigForm<SimulerJournalpostHendelseFormFields>({
    journalpostId: {
      type: 'text',
      label: 'JournalpostID',
      defaultValue: '1234567890',
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
    mottaksKanal: {
      type: 'text',
      label: 'Mottakskanal',
      defaultValue: 'NAV_NO',
    },
    hendelsesType: {
      type: 'select',
      label: 'Hendelsestype',
      defaultValue: 'JournalpostMottatt',
      options: ['JournalpostMottatt', 'TemaEndret'],
    },
    erDigitalSøknad: {
      type: 'switch',
      label: 'Digital søknad (samme oppsett som TestJournalPostBuilder.digitalSøknad())',
      defaultValue: false,
    },
  });

  const handleSubmit = async (data: SimulerJournalpostHendelseFormFields) => {
    setIsLoading(true);
    setMessage('');
    try {
      const res = await postmottakSimulerJournalpostHendelseClient({
        journalpostId: parseInt(data.journalpostId),
        fnr: data.fnr || undefined,
        tema: data.tema,
        temaGammelt: data.temaGammelt || undefined,
        journalpostStatus: data.journalpostStatus,
        mottaksKanal: data.mottaksKanal,
        hendelsesType: data.hendelsesType,
        erDigitalSøknad: data.erDigitalSøknad,
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
    <DevtoolWrapper title="Utviklerverktøy – Simuler journalpost-hendelse (Kafka)">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <HGrid columns={2} gap="space-16">
          <FormField form={form} formField={formFields.journalpostId} />
          <FormField form={form} formField={formFields.fnr} />
          <FormField form={form} formField={formFields.tema} />
          <FormField form={form} formField={formFields.temaGammelt} />
          <FormField form={form} formField={formFields.journalpostStatus} />
          <FormField form={form} formField={formFields.mottaksKanal} />
          <FormField form={form} formField={formFields.hendelsesType} />
          <FormField form={form} formField={formFields.erDigitalSøknad} />
        </HGrid>

        {message && <Alert variant="info">{message}</Alert>}

        <Button className={'fit-content'} loading={isLoading}>
          Simuler journalpost-hendelse
        </Button>
      </form>
    </DevtoolWrapper>
  );
};
