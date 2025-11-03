'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, getJaNeiEllerIkkeBesvart, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  BeregningTidspunktGrunnlag,
  ForutgåendeMedlemskapGrunnlag,
  HistoriskForutgåendeMedlemskapVurdering,
  MellomlagretVurdering,
  RettighetsperiodeGrunnlag,
} from 'lib/types/types';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { formaterDatoForFrontend } from 'lib/utils/date';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: ForutgåendeMedlemskapGrunnlag;
  rettighetsperiodeGrunnlag?: RettighetsperiodeGrunnlag;
  beregningstidspunktGrunnlag?: BeregningTidspunktGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  harForutgåendeMedlemskap: string;
  unntaksvilkår?: string;
}

type DraftFormFields = Partial<FormFields>;

function mapGrunnlagTilForutgående(harForutgåendeMedlemskap?: boolean | null) {
  if (harForutgåendeMedlemskap === true) {
    return JaEllerNei.Ja;
  } else if (harForutgåendeMedlemskap === false) {
    return JaEllerNei.Nei;
  }
  return undefined;
}

function mapGrunnlagTilUnntaksvilkår(
  harForutgåendeMedlemskap?: boolean | null,
  varMedlemMedNedsattArbeidsevne?: boolean | null,
  medlemMedUnntakAvMaksFemÅr?: boolean | null
) {
  if (varMedlemMedNedsattArbeidsevne === true) {
    return 'A';
  } else if (medlemMedUnntakAvMaksFemÅr === true) {
    return 'B';
  } else if (harForutgåendeMedlemskap !== undefined && harForutgåendeMedlemskap !== null) {
    return 'Nei';
  }
  return undefined;
}

const begrunnelseLabel = 'Vurder brukerens forutgående medlemskap';
const harForutgåendeMedlemskapLabel = 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?';
const unntaksvilkårLabel = 'Oppfyller brukeren noen av unntaksvilkårene?';

export const ManuellVurderingForutgåendeMedlemskap = ({
  grunnlag,
  rettighetsperiodeGrunnlag,
  beregningstidspunktGrunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { isLoading, status, løsBehovOgGåTilNesteSteg, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_MEDLEMSKAP');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_MEDLEMSKAP',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: begrunnelseLabel,
        rules: { required: 'Du må gi en begrunnelse på brukerens forutgående medlemskap' },
        defaultValue: defaultValues.begrunnelse,
      },
      harForutgåendeMedlemskap: {
        type: 'radio',
        label: harForutgåendeMedlemskapLabel,
        options: JaEllerNeiOptions,
        rules: { required: 'Du må velge om brukeren har fem års forutgående medlemskap' },
        defaultValue: defaultValues.harForutgåendeMedlemskap,
      },
      unntaksvilkår: {
        type: 'radio',
        label: unntaksvilkårLabel,
        options: [
          {
            value: 'A',
            label: `a: Ja, brukeren har vært medlem i folketrygden i minst ett år umiddelbart før krav om ytelsen settes fram (${rettighetsperiodeGrunnlag?.søknadsdato ? formaterDatoForFrontend(rettighetsperiodeGrunnlag?.søknadsdato) : '(Søknadsdato ikke funnet)'}), og var medlem i trygden da arbeidsevnen ble nedsatt med minst halvparten (${beregningstidspunktGrunnlag?.vurdering?.nedsattArbeidsevneDato ? formaterDatoForFrontend(beregningstidspunktGrunnlag?.vurdering?.nedsattArbeidsevneDato) : '(Dato for nedsatt arbeidsevne ikke funnet)'}), og etter fylte 16 år har perioder med medlemskap som minst tilsvarer perioder uten medlemskap`,
          },
          {
            value: 'B',
            label: `b: Ja, brukeren har vært medlem i folketrygden i minst ett år umiddelbart før krav om ytelsen settes fram (${rettighetsperiodeGrunnlag?.søknadsdato ? formaterDatoForFrontend(rettighetsperiodeGrunnlag?.søknadsdato) : '(Søknadsdato ikke funnet)'}), og har etter fylte 16 år vært medlem i folketrygden med unntak av maksimum fem år.`,
          },
          { value: 'Nei', label: 'Nei' },
        ],
        rules: { required: 'Du må svare på om brukeren oppfyller noen av unntaksvilkårene' },
        defaultValue: defaultValues.unntaksvilkår,
      },
    },
    { readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: overstyring
              ? Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP
              : Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP,
            manuellVurderingForForutgåendeMedlemskap: {
              begrunnelse: data.begrunnelse,
              harForutgåendeMedlemskap: data.harForutgåendeMedlemskap === JaEllerNei.Ja,
              varMedlemMedNedsattArbeidsevne: data.unntaksvilkår === 'A' ? true : null,
              medlemMedUnntakAvMaksFemAar: data.unntaksvilkår === 'B' ? true : null,
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      );
    })(event);
  };

  const heading = overstyring ? 'Overstyring av § 11-2 Forutgående medlemskap' : '§ 11-2 Forutgående medlemskap';
  const historiskeManuelleVurderinger = grunnlag?.historiskeManuelleVurderinger;
  const harForutgåendeMedlemskap = form.watch('harForutgåendeMedlemskap');

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={heading}
      steg={'VURDER_MEDLEMSKAP'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      status={status}
      visBekreftKnapp={!readOnly}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() =>
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : empptyDraftFormFields())
        );
      }}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {historiskeManuelleVurderinger && historiskeManuelleVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeManuelleVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) => v.erGjeldendeVurdering}
          getFomDato={(v) => v.manuellVurdering.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.manuellVurdering.vurdertAv.ident}
          getVurdertDato={(v) => v.manuellVurdering.vurdertAv.dato}
        />
      )}

      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      <FormField form={form} formField={formFields.harForutgåendeMedlemskap} horizontalRadio />
      {harForutgåendeMedlemskap === JaEllerNei.Nei && (
        <FormField form={form} formField={formFields.unntaksvilkår} className={'radio'} />
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(vurdering: ForutgåendeMedlemskapGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    unntaksvilkår: mapGrunnlagTilUnntaksvilkår(
      vurdering?.harForutgåendeMedlemskap,
      vurdering?.varMedlemMedNedsattArbeidsevne,
      vurdering?.medlemMedUnntakAvMaksFemAar
    ),
    harForutgåendeMedlemskap: mapGrunnlagTilForutgående(vurdering?.harForutgåendeMedlemskap),
  };
}

function empptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    harForutgåendeMedlemskap: '',
    unntaksvilkår: '',
  };
}

function byggFelter(vurdering: HistoriskForutgåendeMedlemskapVurdering): ValuePair[] {
  return [
    {
      label: begrunnelseLabel,
      value: vurdering.manuellVurdering.begrunnelse || '',
    },
    {
      label: harForutgåendeMedlemskapLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.manuellVurdering.harForutgåendeMedlemskap),
    },
    {
      label: unntaksvilkårLabel,
      value: vurdering.manuellVurdering.harForutgåendeMedlemskap
        ? getJaNeiEllerIkkeBesvart(null)
        : getJaNeiEllerIkkeBesvart(
            vurdering.manuellVurdering.varMedlemMedNedsattArbeidsevne === true ||
              vurdering.manuellVurdering.medlemMedUnntakAvMaksFemAar === true
          ),
    },
  ];
}
