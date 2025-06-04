'use client';

import { Alert, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { KlageV0, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import styles from './OpprettKlage.module.css';
import { isSuccess } from 'lib/utils/api';
import { formaterDatoForBackend } from 'lib/utils/date';
import { parse } from 'date-fns';
import { v4 as uuid } from 'uuid';

export interface KlageFormFields {
  kravMottatt: string;
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
        verdi: uuid(),
      },
      type: 'KLAGE',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'KlageV0',
        kravMottatt: formaterDatoForBackend(parse(data.kravMottatt, 'dd.MM.yyyy', new Date())),
        skalOppretteNyBehandling: true,
      } as KlageV0,
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
  });

  if (isLoading) {
    return <Spinner label="Oppretter klage ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="4">
          <ExpansionCard
            aria-label="Opprett klage"
            size={'small'}
            defaultOpen={true}
            className={styles.opprettKlageKort}
          >
            <ExpansionCard.Header className={styles.header}>
              <ExpansionCard.Title size="small">Opprett Klage</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content className={styles.content}>
              <VStack gap="4">
                <FormField form={form} formField={formFields.kravMottatt} size="medium" />
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
            <Button type="submit">Opprett klage</Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
