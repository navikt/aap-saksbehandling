'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';
import { FormkravGrunnlag, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormkravAvvisningVarsel } from 'components/behandlinger/klage/formkrav/formkravvurdering/FormkravAvvisningVarsel';

interface Props {
  grunnlag?: FormkravGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
}

interface FormFields {
  erBrukerPart: JaEllerNei;
  erFristOverholdt: JaEllerNei;
  likevelBehandles?: JaEllerNei;
  erKonkret: JaEllerNei;
  erSignert: JaEllerNei;
  begrunnelse: string;
}

export const FormkravVurdering = ({ behandlingVersjon, grunnlag, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORMKRAV');

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erBrukerPart: {
        type: 'radio',
        label: 'Er klager part i saken?',
        rules: { required: 'Du må svare på om klager er part' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erBrukerPart),
        options: JaEllerNeiOptions,
      },
      erKonkret: {
        type: 'radio',
        label: 'Klages det på konkrete elementer i vedtaket?',
        rules: { required: 'Du må svare på om det klages på konkrete elementer i vedtaket' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erKonkret),
        options: JaEllerNeiOptions,
      },
      erFristOverholdt: {
        type: 'radio',
        label: 'Er klagefristen overholdt?',
        rules: { required: 'Du må svare på om fristen er overholdt' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erFristOverholdt),
        options: JaEllerNeiOptions,
      },
      likevelBehandles: {
        type: 'radio',
        label: 'Skal klagen likevel behandles?',
        rules: { required: 'Du må svare på om fristen er overholdt' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.likevelBehandles),
        options: [
          {
            label: 'Ja, det er særlig grunner, eller brukeren kan ikke klandres for forsinkelsen',
            value: JaEllerNei.Ja,
          },
          { label: 'Nei', value: JaEllerNei.Nei },
        ],
      },
      erSignert: {
        type: 'radio',
        label: 'Er klagen signert?',
        rules: { required: 'Du må svare på om klagen er signert' },
        defaultValue: getJaNeiEllerUndefined(grunnlag?.vurdering?.erSignert),
        options: JaEllerNeiOptions,
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurdering',
        description: 'Vurder om formkrav til klage er oppfylt',
        rules: { required: 'Du må skrive en vurdering' },
        defaultValue: grunnlag?.vurdering?.begrunnelse,
      },
    },
    { readOnly, shouldUnregister: true }
  );

  const { erKonkret, erSignert, erBrukerPart, erFristOverholdt, likevelBehandles } = form.watch();
  const avvistGrunnetFrist = erFristOverholdt === JaEllerNei.Nei && likevelBehandles === JaEllerNei.Nei;
  const formkravErIkkeOppfylltVarsel =
    !avvistGrunnetFrist &&
    (erBrukerPart === JaEllerNei.Nei || erKonkret === JaEllerNei.Nei || erSignert === JaEllerNei.Nei);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
        behandlingVersjon: behandlingVersjon,
        behov: {
          behovstype: Behovstype.VURDER_FORMKRAV,
          formkravVurdering: {
            erBrukerPart: data.erBrukerPart === JaEllerNei.Ja,
            erFristOverholdt: data.erFristOverholdt === JaEllerNei.Ja,
            likevelBehandles: data.likevelBehandles ? data.likevelBehandles === JaEllerNei.Ja : undefined,
            erKonkret: data.erKonkret === JaEllerNei.Ja,
            erSignert: data.erSignert === JaEllerNei.Ja,
            begrunnelse: data.begrunnelse,
          },
        },
        referanse: behandlingsreferanse,
      });
    })(event);
  };

  return (
    <VilkårsKortMedForm
      heading={'Formkrav'}
      steg={'FORMKRAV'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
    >
      <FormField form={form} formField={formFields.begrunnelse} />
      <FormField form={form} formField={formFields.erBrukerPart} horizontalRadio />
      <FormField form={form} formField={formFields.erFristOverholdt} horizontalRadio />
      {erFristOverholdt === JaEllerNei.Nei && <FormField form={form} formField={formFields.likevelBehandles} />}
      <FormField form={form} formField={formFields.erKonkret} horizontalRadio />
      <FormField form={form} formField={formFields.erSignert} horizontalRadio />
      {grunnlag?.varselSvarfrist != null && !readOnly && formkravErIkkeOppfylltVarsel && (
        <FormkravAvvisningVarsel frist={new Date(grunnlag.varselSvarfrist)} />
      )}
    </VilkårsKortMedForm>
  );
};
