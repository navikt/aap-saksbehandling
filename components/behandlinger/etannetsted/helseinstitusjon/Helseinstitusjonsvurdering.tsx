'use client';

import { VilkårsKort } from 'components/vilkårskort/VilkårsKort';
import { HospitalIcon } from '@navikt/aksel-icons';
import { Alert } from '@navikt/ds-react';
import { Form } from 'components/form/Form';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { useConfigForm, FormField } from '@navikt/aap-felles-react';
import { FormEvent } from 'react';
import { DokumentTabell } from 'components/dokumenttabell/DokumentTabell';
import {
  Behovstype,
  JaEllerNei,
  JaEllerNeiOptions,
  getJaNeiEllerUndefined,
  jaNeiEllerUndefinedToNullableBoolean,
} from 'lib/utils/form';
import { TilknyttedeDokumenter } from 'components/tilknyttededokumenter/TilknyttedeDokumenter';
import { InstitusjonsoppholdTabell } from '../InstitusjonsoppholdTabell';
import { HelseinstitusjonGrunnlagResponse } from 'lib/types/types';

type Props = {
  grunnlag: HelseinstitusjonGrunnlagResponse;
  behandlingVersjon: number;
  readOnly: boolean;
};

interface FormFields {
  begrunnelse: string;
  dokumenterBruktIVurderingen: string[];
  faarFriKostOgLosji: JaEllerNei;
  forsoergerEktefelle: JaEllerNei;
  harFasteUtgifter: JaEllerNei;
}

export const Helseinstitusjonsvurdering = ({ grunnlag, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, isLoading, status } = useLøsBehovOgGåTilNesteSteg('DU_ER_ET_ANNET_STED');
  const { formFields, form } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vurder §11-25 og om det skal gis reduksjon av ytelsen',
        defaultValue: grunnlag?.helseinstitusjonGrunnlag?.begrunnelse,
        rules: { required: 'Du må begrunne vurderingen din' },
      },
      faarFriKostOgLosji: {
        type: 'radio',
        label: 'Får søker fri kost og losji?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.faarFriKostOgLosji),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker får fri kost og losji' },
      },
      forsoergerEktefelle: {
        type: 'radio',
        label: 'Forsørger søker ektefelle?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.forsoergerEktefelle),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker forsørger ektefelle' },
      },
      harFasteUtgifter: {
        type: 'radio',
        label: 'Har søker faste utgifter nødvendig for å beholde bolig og annet?',
        defaultValue: getJaNeiEllerUndefined(grunnlag?.helseinstitusjonGrunnlag?.harFasteUtgifter),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om søker har faste utgifter nødvendig for å beholde bolig og annet' },
      },
      dokumenterBruktIVurderingen: {
        type: 'checkbox_nested',
        label: 'Søker har opphold på helseinstitusjon over 3 mnd. Vurder om ytelsen skal reduseres',
        description: 'Les dokumentene og tilknytt relevante dokumenter til vurdering om ytelsen skal reduseres',
      },
    },
    { shouldUnregister: true, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.AVKLAR_HELSEINSTITUSJON,
          helseinstitusjonVurdering: {
            dokumenterBruktIVurdering: [],
            begrunnelse: data.begrunnelse,
            faarFriKostOgLosji: data.faarFriKostOgLosji === JaEllerNei.Ja,
            forsoergerEktefelle: jaNeiEllerUndefinedToNullableBoolean(data.forsoergerEktefelle),
            harFasteUtgifter: jaNeiEllerUndefinedToNullableBoolean(data.harFasteUtgifter),
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKort heading={'Helseinstitusjon § 11-25'} steg={'DU_ER_ET_ANNET_STED'} icon={<HospitalIcon />}>
      <Form
        onSubmit={handleSubmit}
        status={status}
        isLoading={isLoading}
        steg={'AVKLAR_STUDENT'}
        visBekreftKnapp={!readOnly}
      >
        {grunnlag.helseinstitusjonOpphold.length > 0 && (
          <Alert variant={'warning'}>
            Vi har funnet en eller flere registrerte opphold på helseinstitusjon som kan påvirke ytelsen
          </Alert>
        )}
        <FormField form={form} formField={formFields.dokumenterBruktIVurderingen}>
          <DokumentTabell />
        </FormField>
        <TilknyttedeDokumenter dokumenter={form.watch('dokumenterBruktIVurderingen')} />
        <InstitusjonsoppholdTabell
          label={'Søker har følgende institusjonsopphold på helseinstitusjon'}
          beskrivelse={'Opphold over tre måneder på helseinstitusjon kan gi redusert AAP ytelse'}
          instutisjonsopphold={grunnlag.helseinstitusjonOpphold}
        />
        <FormField form={form} formField={formFields.begrunnelse} />
        <FormField form={form} formField={formFields.faarFriKostOgLosji} />
        {form.watch('faarFriKostOgLosji') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.forsoergerEktefelle} />
        )}
        {form.watch('faarFriKostOgLosji') === JaEllerNei.Ja && (
          <FormField form={form} formField={formFields.harFasteUtgifter} />
        )}
      </Form>
    </VilkårsKort>
  );
};
