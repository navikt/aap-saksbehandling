'use client';

import { Button, ExpansionCard, HStack, Page, VStack } from '@navikt/ds-react';
import Link from 'next/link';
import { ManuellRevurderingV0, SaksInfo, type ÅrsakTilBehandling } from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { clientSendHendelse } from 'lib/clientApi';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Spinner } from 'components/felles/Spinner';
import { useRouter } from 'next/navigation';

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
  { label: 'Utenlandsopphold før søknadstidspunkt', value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT' },
];

export interface ManuellRevurderingFormFields {
  årsak: string;
  beskrivelse: string;
}

export const OpprettRevurdering = ({ sak }: { sak: SaksInfo }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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
        årsakerTilBehandling: [data.årsak],
        beskrivelse: data.beskrivelse,
      } as ManuellRevurderingV0,
    };

    setIsLoading(true);

    await clientSendHendelse(innsending)
      .then(() => {
        setTimeout(() => router.push(`/saksbehandling/sak/${sak.saksnummer}`), 2000);
      })
      .catch((err) => {
        setIsLoading(false);
        throw new Error('En ukjent feil oppsto ved opprettelse av revurdering', err);
      });
  }

  const { form, formFields } = useConfigForm<ManuellRevurderingFormFields>({
    beskrivelse: {
      type: 'textarea',
      label: 'Hva er årsaken?',
      rules: {
        required: 'Skriv litt om hvorfor du skal starte en revurdering',
      },
    },
    årsak: {
      type: 'combobox',
      label: 'Hvilke opplysninger skal revurderes?',
      options: årsakOptions,
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
          <ExpansionCard aria-label="Opprett revurdering" size={'small'} defaultOpen={true}>
            <ExpansionCard.Header>
              <ExpansionCard.Title>Opprett revurdering</ExpansionCard.Title>
            </ExpansionCard.Header>

            <ExpansionCard.Content>
              <VStack gap="4">
                <div>
                  <FormField form={form} formField={formFields.årsak} size="medium" />
                </div>
                <FormField form={form} formField={formFields.beskrivelse} size="medium" />
              </VStack>
            </ExpansionCard.Content>
          </ExpansionCard>

          <HStack gap="4">
            <Button type="button" variant="secondary" as={Link} href={`/saksbehandling/sak/${sak.saksnummer}`}>
              Avbryt
            </Button>
            <Button type="submit">Opprett revurdering</Button>
          </HStack>
        </VStack>
      </form>
    </Page.Block>
  );
};
