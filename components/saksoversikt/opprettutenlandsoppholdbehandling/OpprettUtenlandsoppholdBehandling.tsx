'use client';

import { Button, HStack, Page, VStack } from '@navikt/ds-react';
import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Kort } from 'components/kort/Kort';
import { clientOpprettUtenlandsoppholdBehandling } from 'lib/clientApi';
import { isSuccess } from 'lib/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormFields {
  beskrivelse: string;
}

export const OpprettUtenlandsoppholdBehandling = ({ saksnummer }: { saksnummer: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const { form, formFields } = useConfigForm<FormFields>({
    beskrivelse: {
      type: 'textarea',
      label: 'Hvorfor opprettes behandlingen?',
      rules: {
        validate: (value) => (value?.trim() ? undefined : 'Du må beskrive hvorfor behandlingen opprettes.'),
      },
    },
  });

  async function opprett(data: FormFields) {
    setIsLoading(true);
    const res = await clientOpprettUtenlandsoppholdBehandling(saksnummer, { beskrivelse: data.beskrivelse.trim() });
    if (isSuccess(res)) {
      router.push(`/saksbehandling/sak/${saksnummer}`);
    } else {
      setError(res.apiException.message);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Spinner label="Oppretter behandling ..." />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit(opprett)}>
        <VStack gap="space-16">
          <Kort heading="Opprett behandling av søknad om opphold i utlandet">
            <FormField form={form} formField={formFields.beskrivelse} size="medium" />
          </Kort>

          {error && (
            <Alert variant="error" size="small">
              {error}
            </Alert>
          )}

          <HStack gap="space-16">
            <Button type="submit">Bekreft</Button>
            <Button type="button" variant="secondary" onClick={() => router.push(`/saksbehandling/sak/${saksnummer}`)}>
              Avbryt
            </Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
