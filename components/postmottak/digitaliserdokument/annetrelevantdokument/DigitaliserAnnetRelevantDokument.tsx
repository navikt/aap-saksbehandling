'use client';

import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

import { Button, VStack } from '@navikt/ds-react';
import { AnnetRelevantDokument, AnnetRelevantDokumentUnderkategori, DokumentÅrsakTilBehandling } from 'lib/types/types';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { SubmitEventHandler } from 'react';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';

export interface AnnetRelevantDokumentFormFields {
  årsaker: string[];
  begrunnelse: string;
  underkategori: AnnetRelevantDokumentUnderkategori;
}

interface Props extends Submittable {
  grunnlag: DigitaliseringsGrunnlag;
  readOnly: boolean;
  isLoading: boolean;
}

const kategorierOptions: ValuePair<NonNullable<AnnetRelevantDokumentUnderkategori>>[] = [
  { label: 'Arbeidsutprøving', value: 'ARBEIDSUTPROVING' },
  { label: 'Barnetillegg', value: 'BARNETILLEGG' },
  { label: 'Etablering', value: 'ETABLERING' },
  { label: 'Ettersendelse til feilutbetaling', value: 'ETTERSENDELSE_TIL_FEILUTBETALING' },
  { label: 'Ettersendelse til klage', value: 'ETTERSENDELSE_TIL_KLAGE' },
  { label: 'Fengsel/varetekt', value: 'FENGSEL_VARETEKT' },
  { label: 'Helseopplysninger', value: 'HELSEOPPLYSNINGER' },
  { label: 'Institusjonsopphold', value: 'INSTITUSJONSOPPHOLD' },
  { label: 'Karakterutskrifter og CV', value: 'KARAKTERUTSKRIFTER_OG_CV' },
  { label: 'Klage', value: 'KLAGE' },
  { label: 'Lærling', value: 'LAERLING' },
  { label: 'Medlemskap', value: 'MEDLEMSKAP' },
  { label: 'Partsinnsyn', value: 'PARTSINNSYN' },
  { label: 'Refusjonskrav', value: 'REFUSJONSKRAV' },
  { label: 'Sluttavtale', value: 'SLUTTAVTALE' },
  { label: 'Studentbestemmelsen', value: 'STUDENTBESTEMMELSEN' },
  { label: 'Tiltaksrapport', value: 'TILTAKSRAPPORT' },
  { label: 'Yrkesskade', value: 'YRKESSKADE' },
];

function mapTilAnnetRelevantDokumentKontrakt(data: AnnetRelevantDokumentFormFields) {
  const dokument = {
    meldingType: 'AnnetRelevantDokumentV1',
    årsakerTilBehandling: data.årsaker.map((årsak) => årsak as DokumentÅrsakTilBehandling),
    begrunnelse: data.begrunnelse,
    underkategori: data.underkategori,
  } satisfies AnnetRelevantDokument;
  return JSON.stringify(dokument);
}

export const DigitaliserAnnetRelevantDokument = ({ grunnlag, readOnly, submit, isLoading }: Props) => {
  const annetRelevantDokumentGrunnlag: AnnetRelevantDokument = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : {};

  const vurderingsbehov = vurderingsbehovOptions();
  const defaultÅrsakOptions: string[] = (annetRelevantDokumentGrunnlag.årsakerTilBehandling || [])
    .map((årsakFraGrunnlag) => vurderingsbehov.find((årsak) => årsak.value === årsakFraGrunnlag))
    .filter((e) => e !== undefined)
    .map((e) => e.value);

  const { form, formFields } = useConfigForm<AnnetRelevantDokumentFormFields>(
    {
      årsaker: {
        type: 'combobox_multiple',
        label: 'Hvilke opplysninger inneholder dokumentet?',
        description:
          'Valget du tar her bestemmer hva som eventuelt skal vurderes på nytt. Om det skal opprettes en ny vurdering/revurdering velger du i neste steg.',
        options: vurderingsbehov,
        defaultValue: defaultÅrsakOptions,
        rules: { required: 'Du må velge minst en årsak' },
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Begrunnelse',
        defaultValue: annetRelevantDokumentGrunnlag.begrunnelse || '',
        rules: { required: 'Du må oppgi begrunnelse.' },
      },
      underkategori: {
        type: 'select',
        label: 'Underkategori',
        defaultValue: annetRelevantDokumentGrunnlag.underkategori || '',
        description: 'Velg kategorien som passer best for dokumentet. Dette gjør dokumentet enklere å finne og forstå.',
        options: ['', ...kategorierOptions],
      },
    },
    { readOnly }
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => submit('ANNET_RELEVANT_DOKUMENT', mapTilAnnetRelevantDokumentKontrakt(data), null))(
      event
    );
  };

  return (
    <VilkårsKort heading={'Annet relevant dokument'}>
      <form onSubmit={handleSubmit}>
        <VStack gap={'space-24'}>
          <FormField form={form} formField={formFields.underkategori} />
          <FormField form={form} formField={formFields.årsaker} />
          <FormField form={form} formField={formFields.begrunnelse} />
          {!readOnly && (
            <Button loading={isLoading} className={'fit-content'}>
              Neste
            </Button>
          )}
        </VStack>
      </form>
    </VilkårsKort>
  );
};
