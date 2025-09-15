'use client';

import { Behovstype, getJaNeiEllerUndefined, JaEllerNei, JaEllerNeiOptions } from 'lib/utils/form';
import { MellomlagretVurdering, SykepengeerstatningGrunnlag, SykepengeerstatningVurderingGrunn } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useConfigForm } from 'components/form/FormHook';
import { FormField, ValuePair } from 'components/form/FormField';
import { VilkårskortMedFormOgMellomlagring } from 'components/vilkårskort/vilkårskortmedformogmellomlagring/VilkårskortMedFormOgMellomlagring';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { TidligereVurderinger } from '../../../tidligerevurderinger/TidligereVurderinger';
import { formaterDatoForFrontend } from '../../../../lib/utils/date';
import { formaterDatoForBackend } from '../../../../lib/utils/date';
import { parse } from 'date-fns';
import { deepEqual } from '../../../tidligerevurderinger/TidligereVurderingerUtils';

interface Props {
  behandlingVersjon: number;
  grunnlag?: SykepengeerstatningGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface FormFields {
  begrunnelse: string;
  erOppfylt: string;
  gjelderFra?: string;
  grunn?: SykepengeerstatningVurderingGrunn;
}

type DraftFormFields = Partial<FormFields>;

export const Sykepengeerstatning = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_SYKEPENGEERSTATNING');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.VURDER_SYKEPENGEERSTATNING_KODE, initialMellomlagretVurdering);

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.vurdering);

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
      },
      erOppfylt: {
        type: 'radio',
        label: 'Har brukeren krav på sykepengeerstatning?',
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
    { shouldUnregister: true, readOnly: readOnly }
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
              vurderingGjelderFra: formaterDatoForBackend(parse(data.gjelderFra, 'dd.MM.yyyy', new Date())),
            },
          },
          referanse: behandlingsReferanse,
        },
        () => nullstillMellomlagretVurdering()
      )
    )(event);
  };

  return (
    <VilkårskortMedFormOgMellomlagring
      heading={'§ 11-13 AAP som sykepengeerstatning'}
      steg="VURDER_SYKEPENGEERSTATNING"
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      visBekreftKnapp={!readOnly}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.vurdering?.vurdertAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(grunnlag?.vurdering ? mapVurderingToDraftFormFields(grunnlag.vurdering) : emptyDraftFormFields());
        });
      }}
      readOnly={readOnly}
    >
      {!!historiskeVurderinger?.length && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          //getErGjeldende={(v) => grunnlag?.vurdering..some((gjeldendeVurdering) => deepEqual(v, gjeldendeVurdering))}
          getFomDato={(v) => v.vurderingGjelderFra}
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
    </VilkårskortMedFormOgMellomlagring>
  );
};

function mapVurderingToDraftFormFields(vurdering: SykepengeerstatningGrunnlag['vurdering']): DraftFormFields {
  return {
    begrunnelse: vurdering?.begrunnelse,
    erOppfylt: getJaNeiEllerUndefined(vurdering?.harRettPå),
    grunn: vurdering?.grunn,
    gjelderFra: formaterDatoForFrontend(vurdering?.vurderingGjelderFra),
  };
}

function emptyDraftFormFields(): DraftFormFields {
  return { begrunnelse: '', erOppfylt: '', grunn: undefined };
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

const byggFelter = (grunnlag: SykepengeerstatningGrunnlag['vurdering']): ValuePair[] => [
  {
    label: 'Vilkårsvurdering',
    value: grunnlag?.begrunnelse ? 'Ja' : 'Nei',
  },
  {
    label: 'Gjelder fra',
    value: `${grunnlag.vurderingGjelderFra ? formaterDatoForFrontend(grunnlag.vurderingGjelderFra) : ''}`,
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
