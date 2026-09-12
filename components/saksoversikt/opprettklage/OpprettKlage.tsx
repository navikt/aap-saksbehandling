'use client';

import { Button, HStack, Page, VStack } from '@navikt/ds-react';
import { parse } from 'date-fns';
import { clientSendHendelse } from 'lib/clientApi';
import { KlageV0, SaksInfo } from 'lib/types/types';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForBackend } from 'lib/utils/date';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Kort } from 'components/kort/Kort';

export interface KlageFormFields {
  kravMottatt: string;
  beskrivelse: string;
}

export const OpprettKlage = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function sendHendelse(data: KlageFormFields) {
    const innsending = {
      saksnummer: sak.saksnummer,
      referanse: {
        type: 'MANUELL_OPPRETTELSE',
        verdi: crypto.randomUUID(),
      },
      type: 'KLAGE',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'KlageV0',
        kravMottatt: formaterDatoForBackend(parse(data.kravMottatt, 'dd.MM.yyyy', new Date())),
        beskrivelse: data.beskrivelse,
      } satisfies KlageV0,
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

  const { form, formFields } = useConfigForm<KlageFormFields>({
    kravMottatt: {
      type: 'date_input',
      label: 'Dato for mottatt klage',
      rules: { required: 'Kravdato for klage må settes' },
    },
    beskrivelse: {
      type: 'textarea',
      label: 'Beskrivelse av klagen',
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter klage ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="space-16">
          <Kort heading={'Opprett klage'}>
            <VStack gap={'space-16'}>
              <FormField form={form} formField={formFields.kravMottatt} size="medium" />
              <FormField form={form} formField={formFields.beskrivelse} size="medium" />
            </VStack>
          </Kort>
          {error && (
            <Alert variant={'error'} size={'small'}>
              {error}
            </Alert>
          )}
          <HStack gap="space-16">
            <Button type="submit">Opprett klage</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/saksbehandling/sak/${sak.saksnummer}`)}
            >
              Avbryt
            </Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
