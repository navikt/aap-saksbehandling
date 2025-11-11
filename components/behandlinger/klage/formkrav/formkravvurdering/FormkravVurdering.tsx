'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { useConfigForm } from 'components/form/FormHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { FormField } from 'components/form/FormField';
import { FormkravGrunnlag, MellomlagretVurdering, TypeBehandling } from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { FormkravAvvisningVarsel } from 'components/behandlinger/klage/formkrav/formkravvurdering/FormkravAvvisningVarsel';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

interface Props {
  grunnlag?: FormkravGrunnlag;
  behandlingVersjon: number;
  typeBehandling: TypeBehandling;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  erBrukerPart: string;
  erFristOverholdt: string;
  likevelBehandles?: string;
  erKonkret: string;
  erSignert: string;
  begrunnelse: string;
}

type DraftFormFields = Partial<FormFields>;

export const FormkravVurdering = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FORMKRAV');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.VURDER_FORMKRAV, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'FORMKRAV',
    mellomlagretVurdering
  );

  const defaultValue: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { formFields, form } = useConfigForm<FormFields>(
    {
      erBrukerPart: {
        type: 'radio',
        label: 'Er klager part i saken?',
        rules: { required: 'Du må svare på om klager er part' },
        defaultValue: defaultValue.erBrukerPart,
        options: JaEllerNeiOptions,
      },
      erKonkret: {
        type: 'radio',
        label: 'Klages det på konkrete elementer i vedtaket?',
        rules: { required: 'Du må svare på om det klages på konkrete elementer i vedtaket' },
        defaultValue: defaultValue.erKonkret,
        options: JaEllerNeiOptions,
      },
      erFristOverholdt: {
        type: 'radio',
        label: 'Er klagefristen overholdt?',
        rules: { required: 'Du må svare på om fristen er overholdt' },
        defaultValue: defaultValue.erFristOverholdt,
        options: JaEllerNeiOptions,
      },
      likevelBehandles: {
        type: 'radio',
        label: 'Skal klagen likevel behandles?',
        rules: { required: 'Du må svare på om fristen er overholdt' },
        defaultValue: defaultValue.likevelBehandles,
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
        defaultValue: defaultValue.erSignert,
        options: JaEllerNeiOptions,
      },
      begrunnelse: {
        type: 'textarea',
        label: 'Vurdering',
        description: 'Vurder om formkrav til klage er oppfylt',
        rules: { required: 'Du må skrive en vurdering' },
        defaultValue: defaultValue.begrunnelse,
      },
    },
    { readOnly: formReadOnly, shouldUnregister: true }
  );

  const { erKonkret, erSignert, erBrukerPart, erFristOverholdt, likevelBehandles } = form.watch();
  const avvistGrunnetFrist = erFristOverholdt === JaEllerNei.Nei && likevelBehandles === JaEllerNei.Nei;
  const formkravErIkkeOppfylltVarsel =
    !avvistGrunnetFrist &&
    (erBrukerPart === JaEllerNei.Nei || erKonkret === JaEllerNei.Nei || erSignert === JaEllerNei.Nei);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
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
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'Formkrav'}
      steg={'FORMKRAV'}
      onSubmit={handleSubmit}
      vilkårTilhørerNavKontor={false}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() =>
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields())
        )
      }
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      knappTekst={avvistGrunnetFrist ? 'Send til beslutter' : 'Bekreft'}
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
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering: FormkravGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    erBrukerPart: getJaNeiEllerUndefined(vurdering?.erBrukerPart),
    erKonkret: getJaNeiEllerUndefined(vurdering?.erKonkret),
    erFristOverholdt: getJaNeiEllerUndefined(vurdering?.erFristOverholdt),
    likevelBehandles: getJaNeiEllerUndefined(vurdering?.likevelBehandles),
    erSignert: getJaNeiEllerUndefined(vurdering?.erSignert),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    erSignert: '',
    erKonkret: '',
    likevelBehandles: '',
    erFristOverholdt: '',
    erBrukerPart: '',
  };
}
