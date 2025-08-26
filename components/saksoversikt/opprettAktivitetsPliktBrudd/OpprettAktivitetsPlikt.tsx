'use client';

import { Alert, BodyLong, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { AktivitetspliktbruddV0, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import styles from './OpprettAktivitetsplikt.module.css';
import { isSuccess } from 'lib/utils/api';

import { v4 as uuid } from 'uuid';
import { FormField } from 'components/form/FormField';

export interface AktivitetspliktbruddFormFields {
  aktivitetspliktBruddType: 'AKTIVITETSPLIKT_11_7';
}

export const OpprettAktivitetsPliktBrudd = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function sendHendelse(data: AktivitetspliktbruddFormFields) {
    const innsending = {
      saksnummer: sak.saksnummer,
      referanse: {
        type: 'MANUELL_OPPRETTELSE',
        verdi: uuid(),
      },
      type: 'AKTIVITETSPLIKTBRUDD',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        bruddType: data.aktivitetspliktBruddType,
        meldingType: 'AktivitetspliktbruddV0',
      } satisfies AktivitetspliktbruddV0,
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

  const { form, formFields } = useConfigForm<AktivitetspliktbruddFormFields>({
    aktivitetspliktBruddType: {
      type: 'combobox',
      label: 'Hvilket aktivitetspliktbrudd vil du registrere?',
      options: [
        {
          label: 'AKTIVITETSPLIKT_11_7',
          value: 'AKTIVITETSPLIKT_11_7',
        },
        { label: 'AKTIVITETSPLIKT_11_9', value: 'AKTIVITETSPLIKT_11_9' },
      ],
      rules: { required: 'ow' },
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter aktivitetspliktbrudd..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <ExpansionCard
            aria-label="Opprett Aktivitetspliktbrudd"
            size={'small'}
            defaultOpen={true}
            className={styles.opprettKlageKort}
          >
            <ExpansionCard.Header className={styles.header}>
              <ExpansionCard.Title size="small">Opprett Aktivitetspliktbrudd</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content className={styles.content}>
              <VStack gap="4">
                <div>
                  <BodyLong>Oppfølgingsoppgaven ligger på vent til ønsket dato.</BodyLong>
                </div>
                <FormField form={form} formField={formFields.aktivitetspliktBruddType} size="medium" />
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
            <Button type="submit">Opprett Aktivitetspliktbrudd</Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
