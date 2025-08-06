'use client';

import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

import { Button, VStack } from '@navikt/ds-react';
import { AnnetRelevantDokumentV0, DokumentÅrsakTilBehandling } from 'lib/types/types';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';

export interface AnnetRelevantDokumentFormFields {
  årsaker: string[];
}

interface Props extends Submittable {
  grunnlag: DigitaliseringsGrunnlag;
  readOnly: boolean;
  isLoading: boolean;
}

function mapTilAnnetRelevantDokumentKontrakt(data: AnnetRelevantDokumentFormFields) {
  const dokument: AnnetRelevantDokumentV0 = {
    meldingType: 'AnnetRelevantDokumentV0',
    årsakerTilBehandling: data.årsaker.map((årsak) => årsak as DokumentÅrsakTilBehandling),
  };
  return JSON.stringify(dokument);
}
// TODO: Avklar hvilke årsaker som saksbehandler skal kunne sette
const årsakOptions: ValuePair<DokumentÅrsakTilBehandling>[] = [
  { label: 'Yrkesskade', value: 'REVURDER_YRKESSKADE' },
  { label: 'Beregningstidspunkt', value: 'REVURDER_BEREGNING' },
  { value: 'LOVVALG_OG_MEDLEMSKAP', label: 'Lovvalg og medlemskap' },
  { value: 'FORUTGAENDE_MEDLEMSKAP', label: 'Forutgående medlemskap' },
  { value: 'SYKDOM_ARBEVNE_BEHOV_FOR_BISTAND', label: 'Sykdom, arbeidsevne og behov for bistand' },
  { value: 'BARNETILLEGG', label: 'Barnetillegg' },
  { value: 'INSTITUSJONSOPPHOLD', label: 'Institusjonsopphold' },
  { value: 'SAMORDNING_OG_AVREGNING', label: 'Samordning og avregning' },
  { value: 'REFUSJONSKRAV', label: 'Refusjonskrav' },
  { value: 'UTENLANDSOPPHOLD_FOR_SOKNADSTIDSPUNKT', label: 'Utenlandsopphold før søknadstidspunkt' },
  { value: 'REVURDER_MANUELL_INNTEKT', label: 'Manuell inntekt' },
  // { value: '', label: 'Journalfør på saken uten å starte revurdering' }, venter på enum i behandlingsflyt
];

export const DigitaliserAnnetRelevantDokument = ({ grunnlag, readOnly, submit, isLoading }: Props) => {
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
        label: 'Hvilke opplysninger inneholder dokumentet?',
        options: [{ label: '', value: '' }, ...årsakOptions],
        defaultValue: defaultÅrsakOptions,
        rules: { required: 'Du må velge minst en årsak' },
      },
    },
    { readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => submit('ANNET_RELEVANT_DOKUMENT', mapTilAnnetRelevantDokumentKontrakt(data), null))(
      event
    );
  };
  return (
    <VilkårsKort heading={'Annet relevant dokument'}>
      <form onSubmit={handleSubmit}>
        <VStack gap={'6'}>
          <FormField form={form} formField={formFields.årsaker} />
          <Button loading={isLoading} className={'fit-content'}>
            Send inn
          </Button>
        </VStack>
      </form>
    </VilkårsKort>
  );
};
