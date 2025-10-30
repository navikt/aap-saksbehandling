'use client';

import {
  Behovstype,
  getJaNeiEllerIkkeBesvart,
  getJaNeiEllerUndefined,
  getStringEllerUndefined,
  getTrueFalseEllerUndefined,
  JaEllerNei,
  JaEllerNeiOptions,
} from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useCallback } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { Link } from '@navikt/ds-react';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { formaterDatoForBackend, formaterDatoForFrontend, stringToDate } from 'lib/utils/date';
import { isBefore, parse, startOfDay } from 'date-fns';
import { validerDato } from 'lib/validation/dateValidation';
import {
  MellomlagretVurdering,
  SykdomsGrunnlag,
  SykdomsvurderingResponse,
  Sykdomvurdering,
  TypeBehandling,
} from 'lib/types/types';
import { Revurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Revurdering';
import { Førstegangsbehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/Førstegangsbehandling';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { Diagnosesøk } from 'components/behandlinger/sykdom/sykdomsvurdering/Diagnosesøk';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useSak } from 'hooks/SakHook';
import { TidligereVurderinger } from 'components/tidligerevurderinger/TidligereVurderinger';
import { deepEqual } from 'components/tidligerevurderinger/TidligereVurderingerUtils';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortMedFormOgMellomlagringNyVisning } from 'components/vilkårskort/vilkårskortmedformogmellomlagringnyvisning/VilkårskortMedFormOgMellomlagringNyVisning';

export interface SykdomsvurderingFormFields {
  begrunnelse: string;
  vurderingenGjelderFra: string;
  harSkadeSykdomEllerLyte: string;
  kodeverk?: string;
  hoveddiagnose?: ValuePair | null;
  bidiagnose?: ValuePair[] | null;
  erArbeidsevnenNedsatt?: JaEllerNei;
  erSkadeSykdomEllerLyteVesentligdel?: JaEllerNei;
  erNedsettelseIArbeidsevneAvEnVissVarighet?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnHalvparten?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense?: JaEllerNei;
  erNedsettelseIArbeidsevneMerEnnFørtiProsent?: JaEllerNei;
  yrkesskadeBegrunnelse?: string;
}

type DraftFormFields = Partial<SykdomsvurderingFormFields>;

interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  bidiagnoserDeafultOptions?: ValuePair[];
  hoveddiagnoseDefaultOptions?: ValuePair[];
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

const vilkårsvurderingLabel = 'Vilkårsvurdering';
const harSkadeSykdomEllerLyteLabel = 'Har brukeren sykdom, skade eller lyte?';
const erArbeidsevnenNedsattLabel = 'Har brukeren nedsatt arbeidsevne?';
const erNedsettelseIArbeidsevneMerEnnHalvpartenLabel = 'Er arbeidsevnen nedsatt med minst halvparten?';
const erSkadeSykdomEllerLyteVesentligdelLabel =
  'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?';
const erNedsettelseIArbeidsevneAvEnVissVarighetLabel = 'Er den nedsatte arbeidsevnen av en viss varighet?';

export const Sykdomsvurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  bidiagnoserDeafultOptions,
  hoveddiagnoseDefaultOptions,
  typeBehandling,
  initialMellomlagretVurdering,
}: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { slettMellomlagring, lagreMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_SYKDOM_KODE, initialMellomlagretVurdering);

  const diagnosegrunnlag = finnDiagnosegrunnlag(typeBehandling, grunnlag);
  const sykdomsvurdering = grunnlag.sykdomsvurderinger.at(-1);

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_SYKDOM',
    mellomlagretVurdering
  );

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(sykdomsvurdering);

  const behandlingErRevurdering = typeBehandling === 'Revurdering';
  const behandlingErFørstegangsbehandling = typeBehandling === 'Førstegangsbehandling';

  const { formFields, form } = useConfigForm<SykdomsvurderingFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: defaultValues.begrunnelse,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      vurderingenGjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        defaultValue: defaultValues?.vurderingenGjelderFra,
        rules: {
          required: 'Du må velge når vurderingen gjelder fra',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const starttidspunkt = startOfDay(new Date(sak.periode.fom));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), starttidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før starttidspunktet';
              }
            },
          },
        },
      },
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: harSkadeSykdomEllerLyteLabel,
        defaultValue: defaultValues?.harSkadeSykdomEllerLyte,
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om brukeren har sykdom, skade eller lyte' },
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: erArbeidsevnenNedsattLabel,
        defaultValue: defaultValues?.erArbeidsevnenNedsatt,
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om brukeren har nedsatt arbeidsevne' },
      },
      erNedsettelseIArbeidsevneMerEnnHalvparten: {
        type: 'radio',
        label: erNedsettelseIArbeidsevneMerEnnHalvpartenLabel,
        defaultValue: defaultValues?.erNedsettelseIArbeidsevneMerEnnHalvparten,
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst halvparten' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: erSkadeSykdomEllerLyteVesentligdelLabel,
        defaultValue: defaultValues?.erSkadeSykdomEllerLyteVesentligdel,
        options: JaEllerNeiOptions,
        rules: {
          required: 'Du må svare på om sykdom, skade eller lyte er vesentlig medvirkende til nedsatt arbeidsevne',
        },
      },
      kodeverk: {
        type: 'radio',
        label: 'Velg system for diagnoser',
        options: [
          { label: 'Primærhelsetjenesten (ICPC2)', value: 'ICPC2' },
          { label: 'Spesialisthelsetjenesten (ICD10)', value: 'ICD10' },
        ],
        defaultValue: defaultValues.kodeverk,
        rules: { required: 'Du må velge et system for diagnoser' },
        onChange: () => {
          form.setValue('hoveddiagnose', null);
          form.setValue('bidiagnose', null);
        },
      },
      hoveddiagnose: {
        type: 'async_combobox',
        defaultValue: defaultValues.hoveddiagnose !== null ? defaultValues.hoveddiagnose : undefined,
      },
      bidiagnose: {
        type: 'async_combobox',
        defaultValue: defaultValues.bidiagnose !== null ? defaultValues.bidiagnose : undefined,
      },
      erNedsettelseIArbeidsevneAvEnVissVarighet: {
        type: 'radio',
        label: erNedsettelseIArbeidsevneAvEnVissVarighetLabel,
        description: 'Om du svarer nei, vil brukeren vurderes for AAP som sykepengeerstatning etter § 11-13.',
        defaultValue: defaultValues?.erNedsettelseIArbeidsevneAvEnVissVarighet,
        rules: {
          required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet',
        },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 30 prosent?',
        defaultValue: defaultValues?.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense,
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnFørtiProsent: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 40 prosent?',
        defaultValue: defaultValues?.erNedsettelseIArbeidsevneMerEnnHalvparten,
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 40 prosent' },
        options: JaEllerNeiOptions,
      },
      yrkesskadeBegrunnelse: {
        type: 'textarea',
        label: '§ 11-22 AAP ved yrkesskade',
        description:
          'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.',
        rules: { required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30 prosent' },
        defaultValue: defaultValues?.yrkesskadeBegrunnelse,
      },
    },
    { shouldUnregister: false, readOnly: formReadOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SYKDOM_KODE,
            sykdomsvurderinger: [
              {
                dokumenterBruktIVurdering: [],
                begrunnelse: data.begrunnelse,
                vurderingenGjelderFra: data.vurderingenGjelderFra
                  ? formaterDatoForBackend(parse(data.vurderingenGjelderFra, 'dd.MM.yyyy', new Date()))
                  : undefined,
                harSkadeSykdomEllerLyte: data.harSkadeSykdomEllerLyte === JaEllerNei.Ja,
                kodeverk: data?.kodeverk,
                hoveddiagnose: data?.hoveddiagnose?.value,
                bidiagnoser: data.bidiagnose?.map((diagnose) => diagnose.value),
                erArbeidsevnenNedsatt: getTrueFalseEllerUndefined(data.erArbeidsevnenNedsatt),
                erSkadeSykdomEllerLyteVesentligdel: getTrueFalseEllerUndefined(data.erSkadeSykdomEllerLyteVesentligdel),
                erNedsettelseIArbeidsevneMerEnnHalvparten:
                  behandlingErFørstegangsbehandling || behandlingErRevurderingAvFørstegangsbehandling()
                    ? getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnHalvparten)
                    : getTrueFalseEllerUndefined(data.erNedsettelseIArbeidsevneMerEnnFørtiProsent),
                erNedsettelseIArbeidsevneAvEnVissVarighet: getTrueFalseEllerUndefined(
                  data.erNedsettelseIArbeidsevneAvEnVissVarighet
                ),
                erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: getTrueFalseEllerUndefined(
                  data.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
                ),
                yrkesskadeBegrunnelse: data?.yrkesskadeBegrunnelse,
              },
            ],
          },
          referanse: behandlingsReferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
        }
      );
    })(event);
  };

  const vurderingenGjelderFra = form.watch('vurderingenGjelderFra');

  const behandlingErRevurderingAvFørstegangsbehandling = useCallback(() => {
    if (!behandlingErRevurdering) {
      return false;
    }
    const gjelderFra = stringToDate(vurderingenGjelderFra, 'dd.MM.yyyy');
    if (!gjelderFra) {
      return false;
    }
    const søknadsdato = startOfDay(new Date(sak.periode.fom));
    return søknadsdato.getTime() === startOfDay(gjelderFra).getTime();
  }, [behandlingErRevurdering, sak, vurderingenGjelderFra]);

  const historiskeVurderinger = grunnlag.historikkSykdomsvurderinger;

  return (
    <VilkårskortMedFormOgMellomlagringNyVisning
      heading={'§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng'}
      steg="AVKLAR_SYKDOM"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vurdertAvAnsatt={sykdomsvurdering?.vurdertAv}
      knappTekst={'Bekreft'}
      kvalitetssikretAv={grunnlag.kvalitetssikretAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(sykdomsvurdering ? mapVurderingToDraftFormFields(sykdomsvurdering) : emptyDraftFormFields());
        });
      }}
      visningActions={visningActions}
      visningModus={visningModus}
      formReset={form.reset}
    >
      {historiskeVurderinger && historiskeVurderinger.length > 0 && (
        <TidligereVurderinger
          data={historiskeVurderinger}
          buildFelter={byggFelter}
          getErGjeldende={(v) =>
            grunnlag.gjeldendeVedtatteSykdomsvurderinger.some((gjeldendeVurdering) => deepEqual(v, gjeldendeVurdering))
          }
          getFomDato={(v) => v.vurderingenGjelderFra ?? v.vurdertAv.dato}
          getVurdertAvIdent={(v) => v.vurdertAv.ident}
          getVurdertDato={(v) => v.vurdertAv.dato}
        />
      )}
      <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1" target="_blank">
        Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
      </Link>
      <FormField form={form} formField={formFields.begrunnelse} className={'begrunnelse'} />
      {behandlingErRevurdering && <FormField form={form} formField={formFields.vurderingenGjelderFra} />}
      {(behandlingErFørstegangsbehandling || behandlingErRevurderingAvFørstegangsbehandling()) && (
        <Førstegangsbehandling
          form={form}
          formFields={formFields}
          skalVurdereYrkesskade={grunnlag.skalVurdereYrkesskade}
          diagnosesøker={
            <Diagnosesøk
              form={form}
              formFields={formFields}
              readOnly={readOnly}
              hoveddiagnoseDefaultOptions={hoveddiagnoseDefaultOptions}
            />
          }
        />
      )}
      {behandlingErRevurdering && !behandlingErRevurderingAvFørstegangsbehandling() && (
        <Revurdering
          form={form}
          formFields={formFields}
          erÅrsakssammenhengYrkesskade={grunnlag.erÅrsakssammenhengYrkesskade}
          diagnosesøker={
            <Diagnosesøk
              form={form}
              formFields={formFields}
              readOnly={readOnly}
              hoveddiagnoseDefaultOptions={hoveddiagnoseDefaultOptions}
            />
          }
        />
      )}
    </VilkårskortMedFormOgMellomlagringNyVisning>
  );

  function mapVurderingToDraftFormFields(vurdering?: Sykdomvurdering): DraftFormFields {
    return {
      begrunnelse: vurdering?.begrunnelse,
      vurderingenGjelderFra: vurdering?.vurderingenGjelderFra
        ? formaterDatoForFrontend(vurdering?.vurderingenGjelderFra)
        : undefined,
      harSkadeSykdomEllerLyte: getJaNeiEllerUndefined(vurdering?.harSkadeSykdomEllerLyte),
      erArbeidsevnenNedsatt: getJaNeiEllerUndefined(vurdering?.erArbeidsevnenNedsatt),
      erNedsettelseIArbeidsevneMerEnnHalvparten: getJaNeiEllerUndefined(
        vurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten
      ),
      erSkadeSykdomEllerLyteVesentligdel: getJaNeiEllerUndefined(vurdering?.erSkadeSykdomEllerLyteVesentligdel),
      kodeverk: getStringEllerUndefined(diagnosegrunnlag?.kodeverk),
      hoveddiagnose: hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose),
      bidiagnose: bidiagnoserDeafultOptions?.filter((option) => diagnosegrunnlag?.bidiagnoser?.includes(option.value)),
      erNedsettelseIArbeidsevneAvEnVissVarighet: getJaNeiEllerUndefined(
        vurdering?.erNedsettelseIArbeidsevneAvEnVissVarighet
      ),
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: getJaNeiEllerUndefined(
        vurdering?.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense
      ),
      erNedsettelseIArbeidsevneMerEnnFørtiProsent: getJaNeiEllerUndefined(
        vurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten
      ),
      yrkesskadeBegrunnelse: getStringEllerUndefined(vurdering?.yrkesskadeBegrunnelse),
    };
  }
};

function emptyDraftFormFields(): DraftFormFields {
  return {
    begrunnelse: '',
    vurderingenGjelderFra: '',
    harSkadeSykdomEllerLyte: '',
    erArbeidsevnenNedsatt: undefined,
    erNedsettelseIArbeidsevneMerEnnHalvparten: undefined,
    erSkadeSykdomEllerLyteVesentligdel: undefined,
    kodeverk: '',
    hoveddiagnose: undefined,
    bidiagnose: [],
    erNedsettelseIArbeidsevneAvEnVissVarighet: undefined,
    erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: undefined,
    erNedsettelseIArbeidsevneMerEnnFørtiProsent: undefined,
    yrkesskadeBegrunnelse: '',
  };
}

function byggFelter(vurdering: SykdomsvurderingResponse): ValuePair[] {
  return [
    {
      label: vilkårsvurderingLabel,
      value: vurdering.begrunnelse,
    },
    {
      label: harSkadeSykdomEllerLyteLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.harSkadeSykdomEllerLyte),
    },
    {
      label: 'Hoveddiagnose',
      value: vurdering.hoveddiagnose
        ? diagnoseSøker(vurdering.kodeverk as DiagnoseSystem, vurdering.hoveddiagnose)[0]?.label
        : '',
    },
    {
      label: 'Bidiagnose',
      value: (vurdering.bidiagnoser ?? ['Ingen'])
        .map((it) => diagnoseSøker(vurdering.kodeverk as DiagnoseSystem, it)[0]?.label)
        .filter(Boolean)
        .join(', '),
    },
    {
      label: erArbeidsevnenNedsattLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.erArbeidsevnenNedsatt),
    },
    {
      label: erNedsettelseIArbeidsevneMerEnnHalvpartenLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten),
    },
    {
      label: erSkadeSykdomEllerLyteVesentligdelLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.erSkadeSykdomEllerLyteVesentligdel),
    },
    {
      label: erNedsettelseIArbeidsevneAvEnVissVarighetLabel,
      value: getJaNeiEllerIkkeBesvart(vurdering.erNedsettelseIArbeidsevneAvEnVissVarighet),
    },
  ];
}
