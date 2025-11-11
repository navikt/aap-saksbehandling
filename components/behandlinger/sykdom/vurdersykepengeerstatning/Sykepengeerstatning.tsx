'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import {
  MellomlagretVurdering,
  SykepengeerstatningGrunnlag,
  SykepengeerstatningVurderingGrunn,
  SykepengerVurderingResponse,
} from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { parse } from 'date-fns';

interface Props {
  behandlingVersjon: number;
  grunnlag?: SykepengeerstatningGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  erOppfylt: string;
  gjelderFra: string;
  grunn?: SykepengeerstatningVurderingGrunn;
}

type DraftFormFields = Partial<FormFields>;

export const Sykepengeerstatning = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_SYKEPENGEERSTATNING');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.VURDER_SYKEPENGEERSTATNING_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_SYKEPENGEERSTATNING',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurderinger);

  const { form, formFields } = useConfigForm<FormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: 'Vilkårsvurdering',
        rules: { required: 'Du må begrunne avgjørelsen din.' },
        defaultValue: defaultValues?.begrunnelse,
      },
      gjelderFra: {
        type: 'date_input',
        label: 'Gjelder fra',
        rules: { required: 'Du må sette dato' },
        defaultValue: defaultValues?.gjelderFra,
      },
      erOppfylt: {
        type: 'radio',
        label: 'Krav på sykepengeerstatning?',
        rules: { required: 'Du må ta stilling til om brukeren har rett på AAP som sykepengeerstatning.' },
        options: JaEllerNeiOptions,
        defaultValue: defaultValues?.erOppfylt,
      },
      grunn: {
        type: 'radio',
        label: 'Velg én grunn',
        defaultValue: defaultValues?.grunn || undefined,
        rules: { required: 'Du må velge én grunn' },
        options: grunnOptions,
      },
    },
    { shouldUnregister: true, readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) =>
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
            sykepengeerstatningVurdering: {
              begrunnelse: data.begrunnelse,
              dokumenterBruktIVurdering: [],
              harRettPå: data.erOppfylt === JaEllerNei.Ja,
              grunn: data.grunn,
              gjelderFra: data.gjelderFra
                ? formaterDatoForBackend(parse(data.gjelderFra, 'dd.MM.yyyy', new Date()))
                : null,
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-13 AAP som sykepengeerstatning'}
      steg="VURDER_SYKEPENGEERSTATNING"
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag?.vurderinger?.length ? mapVurderingToDraftFormFields(grunnlag.vurderinger) : emptyDraftFormFields()
          );
        });
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {grunnlag?.vedtatteVurderinger && grunnlag?.vedtatteVurderinger?.length > 0 && (
        <TidligereVurderinger
          data={grunnlag?.vedtatteVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={() => true}
          getFomDato={(v) => v.gjelderFra}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      <FormField form={form} formField={formFields.begrunnelse} className="begrunnelse" />
      <FormField form={form} formField={formFields.gjelderFra} className="gjelderFra" />
      <FormField form={form} formField={formFields.erOppfylt} horizontalRadio />
      {form.watch('erOppfylt') === JaEllerNei.Ja && (
        <FormField form={form} formField={formFields.grunn} className={'radio'} />
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );
};

function mapVurderingToDraftFormFields(
  vurderinger: SykepengeerstatningGrunnlag['vurderinger'] | undefined
): DraftFormFields {
  if (!vurderinger || vurderinger.length === 0) {
    return {
      begrunnelse: undefined,
      erOppfylt: undefined,
      grunn: undefined,
      gjelderFra: undefined,
    };
  }
  const sisteVurdering = vurderinger[vurderinger.length - 1];
  return {
    begrunnelse: sisteVurdering.begrunnelse,
    erOppfylt: getJaNeiEllerUndefined(sisteVurdering.harRettPå),
    grunn: sisteVurdering.grunn,
    gjelderFra: sisteVurdering.gjelderFra ? formaterDatoForFrontend(sisteVurdering.gjelderFra) : undefined,
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return { begrunnelse: '', erOppfylt: '', grunn: undefined, gjelderFra: undefined };
}

const grunnOptions: ValuePair<NonNullable<SykepengeerstatningVurderingGrunn>>[] = [
  {
    label:
      'Brukeren har tidligere mottatt arbeidsavklaringspenger og innen seks måneder etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av en annen sykdom',
    value: 'ANNEN_SYKDOM_INNEN_SEKS_MND',
  },
  {
    label:
      'Brukeren har tidligere mottatt arbeidsavklaringspenger og innen ett år etter at arbeidsavklaringspengene er opphørt, blir arbeidsufør som følge av samme sykdom',
    value: 'SAMME_SYKDOM_INNEN_ETT_AAR',
  },
  {
    label:
      'Brukeren har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og igjen blir arbeidsufør på grunn av sykdom eller skade mens han eller hun er i arbeid',
    value: 'SYKEPENGER_IGJEN_ARBEIDSUFOR',
  },
  {
    label:
      'Brukeren har tidligere mottatt sykepenger etter kapittel 8 i til sammen 248, 250 eller 260 sykepengedager i løpet av de tre siste årene, se § 8-12, og fortsatt er arbeidsufør på grunn av sykdom eller skade',
    value: 'SYKEPENGER_FORTSATT_ARBEIDSUFOR',
  },
  {
    label:
      'Brukeren har mottatt arbeidsavklaringspenger og deretter foreldrepenger og innen seks måneder etter foreldrepengene opphørte, blir arbeidsufør på grunn av sykdom eller skade, se § 8-2 andre ledd',
    value: 'FORELDREPENGER_INNEN_SEKS_MND',
  },
];

const byggFelter = (grunnlag: SykepengerVurderingResponse): ValuePair[] => [
  {
    label: 'Vilkårsvurdering',
    value: grunnlag?.begrunnelse,
  },
  {
    label: 'Gjelder fra',
    value: `${grunnlag.gjelderFra ? formaterDatoForFrontend(grunnlag.gjelderFra) : ''}`,
  },
  {
    label: 'Har brukeren krav på sykepengeerstatning?',
    value: grunnlag?.harRettPå ? 'Ja' : 'Nei',
  },
  {
    label: 'Grunn',
    value: grunnOptions.find((option) => option.value === grunnlag?.grunn)?.label ?? '',
  },
];
