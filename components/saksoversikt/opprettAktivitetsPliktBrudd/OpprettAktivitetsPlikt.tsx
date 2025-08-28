'use client';

import { Alert, BodyLong, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { clientOpprettAktivitetsplikt } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import styles from './OpprettAktivitetsplikt.module.css';
import { FormField } from 'components/form/FormField';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { isSuccess } from 'lib/utils/api';
import { useRouter } from 'next/navigation';

export interface AktivitetspliktbruddFormFields {
  aktivitetspliktBruddType: 'AKTIVITETSPLIKT_11_7';
}

export const OpprettAktivitetsPliktBrudd = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function postOpprettAktivitetspliktBrudd(data: any) {
    const res = await clientOpprettAktivitetsplikt(sak.saksnummer);
    if (isSuccess(res)) {
      router.push(`/saksbehandling/sak/${sak.saksnummer}`);
    } else {
      setError(res.apiException.message);
    }
  }

  const { form, formFields } = useConfigForm<AktivitetspliktbruddFormFields>({
    aktivitetspliktBruddType: {
      type: 'combobox',
      label: 'Hvilket aktivitetspliktbrudd vil du registrere?',
      options: [
        {
          label: '§ 11-7',
          value: 'AKTIVITETSPLIKT_11_7',
        },
      ],
      rules: { required: 'Velg ' },
    },
  });

  if (isLoading) {
    return <Spinner label="Oppretter aktivitetspliktbrudd..." />;
  }

  return (
    <Page.Block width="md">
      <form
        onSubmit={(event) => {
          form.handleSubmit((data) => postOpprettAktivitetspliktBrudd(data))(event);
        }}
      >
        <VStack gap="4">
          <ExpansionCard aria-label="Opprett Aktivitetspliktbrudd" size={'small'} defaultOpen={true}>
            <ExpansionCard.Header className={styles.header}>
              <ExpansionCard.Title size="small">Opprett Aktivitetspliktbrudd</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content className={styles.content}>
              <VStack gap="4">
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
              as="a"
              href={`/saksbehandling/sak/${sak.saksnummer}`}
              rel="noreferrer noopener"
              size="small"
              variant="secondary"
              icon={<ExternalLinkIcon aria-hidden />}
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
