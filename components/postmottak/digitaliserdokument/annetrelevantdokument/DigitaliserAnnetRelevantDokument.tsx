'use client';

import { DigitaliseringsGrunnlag } from 'lib/types/postmottakTypes';

import { Button, VStack } from '@navikt/ds-react';
import { AnnetRelevantDokument, DokumentÅrsakTilBehandling } from 'lib/types/types';
import { VilkårsKort } from 'components/postmottak/vilkårskort/VilkårsKort';
import type { Submittable } from 'components/postmottak/digitaliserdokument/DigitaliserDokument';
import { FormField } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { FormEvent } from 'react';
import { vurderingsbehovOptions } from 'lib/utils/vurderingsbehovOptions';
import { useFeatureFlag } from 'context/UnleashContext';

export interface AnnetRelevantDokumentFormFields {
  årsaker: string[];
  begrunnelse: string;
}

interface Props extends Submittable {
  grunnlag: DigitaliseringsGrunnlag;
  readOnly: boolean;
  isLoading: boolean;
}

function mapTilAnnetRelevantDokumentKontrakt(data: AnnetRelevantDokumentFormFields) {
  const dokument = {
    meldingType: 'AnnetRelevantDokumentV1',
    årsakerTilBehandling: data.årsaker.map((årsak) => årsak as DokumentÅrsakTilBehandling),
    begrunnelse: data.begrunnelse,
  } satisfies AnnetRelevantDokument;
  return JSON.stringify(dokument);
}

export const DigitaliserAnnetRelevantDokument = ({ grunnlag, readOnly, submit, isLoading }: Props) => {
  const isRevurderingStarttidspunktEnabled = useFeatureFlag('RevurderStarttidspunkt');
  const annetRelevantDokumentGrunnlag: AnnetRelevantDokument = grunnlag.vurdering?.strukturertDokumentJson
    ? JSON.parse(grunnlag.vurdering?.strukturertDokumentJson)
    : {};

  const vurderingsbehov = vurderingsbehovOptions(isRevurderingStarttidspunktEnabled);
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
