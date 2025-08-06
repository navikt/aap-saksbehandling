'use client';

import { Alert, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { ManuellRevurderingV0, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import styles from './OpprettRevurdering.module.css';
import { isSuccess } from 'lib/utils/api';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';

export interface ManuellRevurderingFormFields {
  årsaker: string[];
  beskrivelse: string;
}

export const OpprettRevurdering = ({
  sak,
  defaultÅrsaker,
  defaultBegrunnelse,
  redirect = false,
}: {
  sak: SaksInfo;
  defaultÅrsaker?: string[];
  defaultBegrunnelse?: string;
  redirect?: boolean;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function sendHendelse(data: ManuellRevurderingFormFields) {
    const innsending = {
      saksnummer: sak.saksnummer,
      referanse: {
        type: 'REVURDERING_ID',
        verdi: uuid(),
      },
      type: 'MANUELL_REVURDERING',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'ManuellRevurderingV0',
        årsakerTilBehandling: data.årsaker,
        beskrivelse: data.beskrivelse,
      } as ManuellRevurderingV0,
    };

    setIsLoading(true);

    const res = await clientSendHendelse(sak.saksnummer, innsending);

    if (isSuccess(res)) {
      redirect && router.push(`/saksbehandling/sak/${sak.saksnummer}`);
    } else {
      setError(res.apiException.message);
    }
    setIsLoading(false);
  }

  const { form, formFields } = useConfigForm<ManuellRevurderingFormFields>({
    beskrivelse: {
      type: 'textarea',
      label: 'Hva er årsaken?',
      rules: {
        required: 'Skriv litt om hvorfor du skal starte en revurdering',
      },
      defaultValue: defaultBegrunnelse ?? '',
    },
    årsaker: {
      type: 'combobox_multiple',
      label: 'Hvilke opplysninger skal revurderes?',
      options: vurderingsbehovOptions,
      defaultValue: defaultÅrsaker,
      rules: {
        required: 'Velg opplysning som er grunnlaget for revurdering',
      },
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter revurdering ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <ExpansionCard
            aria-label="Opprett revurdering"
            size={'small'}
            defaultOpen={true}
            className={styles.opprettRevurderingKort}
          >
            <ExpansionCard.Header className={styles.header}>
              <ExpansionCard.Title size="small">Opprett revurdering</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content className={styles.content}>
              <VStack gap="4">
                <div>
                  <FormField form={form} formField={formFields.årsaker} size="medium" />
                </div>
                <FormField form={form} formField={formFields.beskrivelse} size="medium" />
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
            <Button type="submit">Opprett revurdering</Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
