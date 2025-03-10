'use client';

import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

import { FormField, useConfigForm, ValuePair } from '@navikt/aap-felles-react';
import { VStack } from '@navikt/ds-react';
import type { AnnetRelevantDokumentV0, ÅrsakTilBehandling } from 'lib/types/types';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import { Nesteknapp } from 'components/postmottak/nesteknapp/Nesteknapp';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';

export interface AnnetRelevantDokumentFormFields {
  årsaker: string[];
}

interface Props extends Submittable {
  grunnlag: DigitaliseringsGrunnlag;
  readOnly: boolean;
}

function mapTilAnnetRelevantDokumentKontrakt(data: AnnetRelevantDokumentFormFields) {
  const dokument: AnnetRelevantDokumentV0 = {
    meldingType: 'AnnetRelevantDokumentV0',
    årsakerTilBehandling: data.årsaker.map((årsak) => årsak as ÅrsakTilBehandling),
  };
  return JSON.stringify(dokument);
}
// TODO: Avklar hvilke årsaker som saksbehandler skal kunne sette
const årsakOptions: ValuePair<ÅrsakTilBehandling>[] = [
  { label: 'Mottatt søknad', value: 'SØKNAD' },
  { label: 'Mottatt aktivitetsmelding', value: 'AKTIVITETSMELDING' },
  { label: 'Mottatt meldekort', value: 'MELDEKORT' },
  { label: 'Mottatt legeerklæring', value: 'LEGEERKLÆRING' },
  { label: 'Mottatt dialogmelding', value: 'DIALOGMELDING' },
  { label: 'Revurder medlemskap', value: 'REVURDER_MEDLEMSKAP' },
  { label: 'Revurder yrkesskade', value: 'REVURDER_YRKESSKADE' },
  { label: 'Revurder beregning', value: 'REVURDER_BEREGNING' },
  { label: 'Revurder lovvalg', value: 'REVURDER_LOVVALG' },
];

export const DigitaliserAnnetRelevantDokument = ({ grunnlag, readOnly, submit }: Props) => {
  const annetRelevantDokumentGrunnlag: AnnetRelevantDokumentV0 = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : {};
  const defaultÅrsakOptions: string[] = (annetRelevantDokumentGrunnlag.årsakerTilBehandling || [])
    .map((årsakFraGrunnlag) => årsakOptions.find((årsak) => årsak.value === årsakFraGrunnlag))
    .filter((e) => e !== undefined)
    .map((e) => e.value);

  const { form, formFields } = useConfigForm<AnnetRelevantDokumentFormFields>(
    {
      årsaker: {
        type: 'combobox_multiple',
        label: 'Velg en årsak',
        options: [{ label: '', value: '' }, ...årsakOptions],
        defaultValue: defaultÅrsakOptions,
        rules: { required: 'Du må velge en årsak' },
      },
    },
    { readOnly }
  );

  return (
    <VilkårsKort heading={'Årsak til behandling'}>
      <form
        onSubmit={form.handleSubmit((data) =>
          submit('ANNET_RELEVANT_DOKUMENT', mapTilAnnetRelevantDokumentKontrakt(data), null)
        )}
      >
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.årsaker} />
          <Nesteknapp>Send Inn</Nesteknapp>
        </VStack>
      </form>
    </VilkårsKort>
  );
};
