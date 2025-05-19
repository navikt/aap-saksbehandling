'use client';

import { Alert, Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import { ManuellRevurderingV0, SaksInfo, type ÅrsakTilBehandling } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';
import styles from './OpprettRevurdering.module.css';
import { isProd } from 'lib/utils/environment';
import { isSuccess } from 'lib/utils/api';

const årsakOptions: ValuePair<ÅrsakTilBehandling>[] = [
  { label: 'Lovvalg og medlemskap', value: 'LOVVALG_OG_MEDLEMSKAP' },
  { label: 'Forutgående medlemskap', value: 'FORUTGAENDE_MEDLEMSKAP' },
  { label: 'Sykdom, arbeidsevne og behov for bistand', value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND' },
  { label: 'Beregningstidspunkt', value: 'REVURDER_BEREGNING' },
  { label: 'Barnetillegg', value: 'BARNETILLEGG' },
  { label: 'Institusjonsopphold', value: 'INSTITUSJONSOPPHOLD' },
  { label: 'Samordning og avregning', value: 'SAMORDNING_OG_AVREGNING' },
  { label: 'Refusjonskrav', value: 'REFUSJONSKRAV' },
  { label: 'Yrkesskade', value: 'REVURDER_YRKESSKADE' },
  // TODO ikke prod-klart enda
  //{ label: 'Starttidspunkt', value: 'VURDER_RETTIGHETSPERIODE' },
  // TODO: For at denne skal fungere må det gjøres litt justering i data som sendes i melding.
  // { label: 'Utenlandsopphold før søknadstidspunkt', value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT' },
];

const årsakOptionsDev: ValuePair<ÅrsakTilBehandling>[] = [
  { label: 'Starttidspunkt', value: 'VURDER_RETTIGHETSPERIODE' },
];

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
      options: isProd() ? årsakOptions : [...årsakOptions, ...årsakOptionsDev],
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
