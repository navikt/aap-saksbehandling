'use client';

import { Button, HStack, Page, VStack } from '@navikt/ds-react';
import { useFeatureFlag } from 'context/UnleashContext';
import { useInnloggetBruker } from 'hooks/BrukerHook';
import { clientSendHendelse } from 'lib/clientApi';
import { ManuellRevurderingV0, SaksInfo } from 'lib/types/types';
import { isSuccess } from 'lib/utils/api';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Alert } from 'components/alert/Alert';
import { Spinner } from 'components/felles/Spinner';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { Kort } from 'components/kort/Kort';

export interface ManuellRevurderingFormFields {
  årsaker: string[];
  beskrivelse: string;
}

export const OpprettRevurdering = ({
  sak,
  erFørstegangsbehandling,
  defaultÅrsaker,
  defaultBegrunnelse,
  redirect = false,
}: {
  sak: SaksInfo;
  erFørstegangsbehandling?: boolean;
  defaultÅrsaker?: string[];
  defaultBegrunnelse?: string;
  redirect?: boolean;
}) => {
  const router = useRouter();
  const innloggetBruker = useInnloggetBruker();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function sendHendelse(data: ManuellRevurderingFormFields) {
    const innsending = {
      saksnummer: sak.saksnummer,
      referanse: {
        type: 'REVURDERING_ID',
        verdi: crypto.randomUUID(),
      },
      type: 'MANUELL_REVURDERING',
      kanal: 'DIGITAL',
      mottattTidspunkt: new Date().toISOString(),
      melding: {
        meldingType: 'ManuellRevurderingV0',
        årsakerTilBehandling: data.årsaker as ManuellRevurderingV0['årsakerTilBehandling'],
        beskrivelse: data.beskrivelse,
        opprettetAv: innloggetBruker.NAVident,
      } satisfies ManuellRevurderingV0,
    };

    setIsLoading(true);

    const res = await clientSendHendelse(sak.saksnummer, innsending);

    if (isSuccess(res)) {
      redirect && setTimeout(() => router.push(`/saksbehandling/sak/${sak.saksnummer}`), 2000);
    } else {
      setError(res.apiException.message);
      setIsLoading(false);
    }
  }

  const variant = erFørstegangsbehandling ? 'vurdering' : 'revurdering';
  const erKravEnabled = useFeatureFlag('KravSteg');
  const avslag11_27Enable = useFeatureFlag('Avslag11_27');
  const erRevurdereFrivilligeEnabled = useFeatureFlag('RevurdereFrivillige');

  const { form, formFields } = useConfigForm<ManuellRevurderingFormFields>({
    beskrivelse: {
      type: 'textarea',
      label: 'Hva er årsaken?',
      description: 'Utdyp så det er tydelig for andre i Kelvin hva som er årsak til vurderingsbehovet.',
      rules: {
        required: `Skriv litt om hvorfor du skal ${erFørstegangsbehandling ? 'opprette vurdering' : 'revurdere saken'}.`,
      },
      defaultValue: defaultBegrunnelse ?? '',
    },
    årsaker: {
      type: 'combobox_multiple',
      label: `Hvilke opplysninger skal ${erFørstegangsbehandling ? 'vurderes' : 'revurderes'}?`,
      description: 'Skriv i feltet for å filtrere listen.',
      options: vurderingsbehovOptions(erKravEnabled, avslag11_27Enable, erRevurdereFrivilligeEnabled),
      defaultValue: defaultÅrsaker,
      rules: {
        required: `Velg opplysning som er grunnlaget for ${variant}en`,
      },
    },
  });

  if (isLoading) {
    return <Spinner label={`Oppretter ${variant}...`} />;
  }

  return (
    <Page.Block width="md">
      <form onSubmit={form.handleSubmit((data) => sendHendelse(data))}>
        <VStack gap="space-16">
          <Kort heading={`Opprett ${variant}`}>
            <VStack gap="space-16">
              <div>
                <FormField form={form} formField={formFields.årsaker} size="medium" />
              </div>
              <FormField form={form} formField={formFields.beskrivelse} size="medium" />
            </VStack>
          </Kort>

          {error && <Alert variant={'error'}>{error}</Alert>}

          <HStack gap="space-16">
            <Button type="submit">Opprett {variant}</Button>
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
