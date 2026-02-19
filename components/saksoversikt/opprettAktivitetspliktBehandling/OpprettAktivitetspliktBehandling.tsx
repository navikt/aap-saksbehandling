'use client';

import { Alert, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { OpprettAktivitetspliktBehandlingDto, SaksInfo } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { clientOpprettAktivitetsplikt } from 'lib/clientApi';
import { useState } from 'react';
import { Spinner } from 'components/felles/Spinner';
import styles from './OpprettAktivitetsplikt.module.css';
import { FormField } from 'components/form/FormField';
import { isSuccess } from 'lib/utils/api';
import { useRouter } from 'next/navigation';

export interface AktivitetspliktbruddFormFields {
  aktivitetspliktBruddType: 'AKTIVITETSPLIKT_11_7';
}

export const OpprettAktivitetspliktBehandling = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function postOpprettAktivitetspliktBrudd(data: OpprettAktivitetspliktBehandlingDto) {
    const res = await clientOpprettAktivitetsplikt(sak.saksnummer, data);
    setIsLoading(true);
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
      label: 'Hvilken aktivitetshjemmel skal vurderes?',
      options: [
        {
          label: '§ 11-7',
          value: 'AKTIVITETSPLIKT_11_7',
        },
        {
          label: '§ 11-9',
          value: 'AKTIVITETSPLIKT_11_9',
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
          form.handleSubmit((data) =>
            postOpprettAktivitetspliktBrudd({ vurderingsbehov: data.aktivitetspliktBruddType })
          )(event);
        }}
      >
        <VStack gap="4">
          <ExpansionCard
            aria-label="Opprett vurdering av aktivitetsplikten"
            size={'small'}
            defaultOpen={true}
            className={styles.opprettKlageKort}
          >
            <ExpansionCard.Header className={styles.header}>
              <ExpansionCard.Title size="small">Opprett vurdering av aktivitetsplikten</ExpansionCard.Title>
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
            <Button type="submit">Bekreft</Button>
            <Button
              as="a"
              href={`/saksbehandling/sak/${sak.saksnummer}`}
              rel="noreferrer noopener"
              size="small"
              variant="secondary"
            >
              Avbryt
            </Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
