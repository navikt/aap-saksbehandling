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
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useCallback } from 'react';
import { useBehandlingsReferanse } from 'hooks/BehandlingHook';
import { Alert, Link } from '@navikt/ds-react';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { formaterDatoForBackend, formaterDatoForFrontend, sorterEtterNyesteDato, stringToDate } from 'lib/utils/date';
import { format, isBefore, parse, startOfDay, subDays } from 'date-fns';
import { erDatoFoerDato, validerDato } from 'lib/validation/dateValidation';
import { SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';
import { Revurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/Revurdering';
import { Førstegangsbehandling } from 'components/behandlinger/sykdom/sykdomsvurdering/Førstegangsbehandling';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { Diagnosesøk } from 'components/behandlinger/sykdom/sykdomsvurdering/Diagnosesøk';
import { FormField, ValuePair } from 'components/form/FormField';
import { useConfigForm } from 'components/form/FormHook';
import { useSak } from 'hooks/SakHook';
import { VilkårsKortMedForm } from 'components/vilkårskort/vilkårskortmedform/VilkårsKortMedForm';
import { TidligereVurderingerV3 } from 'components/tidligerevurderinger/TidligereVurderingerV3';
import { deepEqual } from '../../../tidligerevurderinger/TidligereVurderingerUtils';

export interface SykdomsvurderingFormFields {
  begrunnelse: string;
  vurderingenGjelderFra: string;
  harSkadeSykdomEllerLyte: string;
  kodeverk?: DiagnoseSystem;
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

interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  bidiagnoserDeafultOptions?: ValuePair[];
  hoveddiagnoseDefaultOptions?: ValuePair[];
}

export const Sykdomsvurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  bidiagnoserDeafultOptions,
  hoveddiagnoseDefaultOptions,
  typeBehandling,
}: SykdomProps) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { sak } = useSak();
  const { løsBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const behandlingErRevurdering = typeBehandling === 'Revurdering';
  const behandlingErFørstegangsbehandling = typeBehandling === 'Førstegangsbehandling';
  const diagnosegrunnlag = finnDiagnosegrunnlag(typeBehandling, grunnlag);

  const vilkårsvurderingLabel = 'Vilkårsvurdering';
  const harSkadeSykdomEllerLyteLabel = 'Har brukeren sykdom, skade eller lyte?';
  const erArbeidsevnenNedsattLabel = 'Har brukeren nedsatt arbeidsevne?';
  const erNedsettelseIArbeidsevneMerEnnHalvpartenLabel = 'Er arbeidsevnen nedsatt med minst halvparten?';
  const erSkadeSykdomEllerLyteVesentligdelLabel =
    'Er sykdom, skade eller lyte vesentlig medvirkende til at arbeidsevnen er nedsatt?';
  const erNedsettelseIArbeidsevneAvEnVissVarighetLabel = 'Er den nedsatte arbeidsevnen av en viss varighet?';

  const sykdomsvurdering = grunnlag.sykdomsvurderinger.at(-1);

  const { formFields, form } = useConfigForm<SykdomsvurderingFormFields>(
    {
      begrunnelse: {
        type: 'textarea',
        label: vilkårsvurderingLabel,
        defaultValue: sykdomsvurdering?.begrunnelse,
        rules: { required: 'Du må gjøre en vilkårsvurdering' },
      },
      vurderingenGjelderFra: {
        type: 'date_input',
        label: 'Vurderingen gjelder fra',
        defaultValue: sykdomsvurdering?.vurderingenGjelderFra
          ? formaterDatoForFrontend(sykdomsvurdering?.vurderingenGjelderFra)
          : undefined,
        rules: {
          required: 'Du må velge når vurderingen gjelder fra',
          validate: {
            gyldigDato: (v) => validerDato(v as string),
            kanIkkeVaereFoerSoeknadstidspunkt: (v) => {
              const soknadstidspunkt = startOfDay(new Date(sak.periode.fom));
              const vurderingGjelderFra = stringToDate(v as string, 'dd.MM.yyyy');
              if (vurderingGjelderFra && isBefore(startOfDay(vurderingGjelderFra), soknadstidspunkt)) {
                return 'Vurderingen kan ikke gjelde fra før søknadstidspunkt';
              }
            },
          },
        },
      },
      harSkadeSykdomEllerLyte: {
        type: 'radio',
        label: harSkadeSykdomEllerLyteLabel,
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.harSkadeSykdomEllerLyte),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om brukeren har sykdom, skade eller lyte' },
      },
      erArbeidsevnenNedsatt: {
        type: 'radio',
        label: erArbeidsevnenNedsattLabel,
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erArbeidsevnenNedsatt),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om brukeren har nedsatt arbeidsevne' },
      },
      erNedsettelseIArbeidsevneMerEnnHalvparten: {
        type: 'radio',
        label: erNedsettelseIArbeidsevneMerEnnHalvpartenLabel,
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten),
        options: JaEllerNeiOptions,
        rules: { required: 'Du må svare på om arbeidsevnen er nedsatt med minst halvparten' },
      },
      erSkadeSykdomEllerLyteVesentligdel: {
        type: 'radio',
        label: erSkadeSykdomEllerLyteVesentligdelLabel,
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erSkadeSykdomEllerLyteVesentligdel),
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
        defaultValue: getStringEllerUndefined(diagnosegrunnlag?.kodeverk),
        rules: { required: 'Du må velge et system for diagnoser' },
        onChange: () => {
          form.setValue('hoveddiagnose', null);
          form.setValue('bidiagnose', null);
        },
      },
      hoveddiagnose: {
        type: 'async_combobox',
        defaultValue: hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose),
      },
      bidiagnose: {
        type: 'async_combobox',
        defaultValue: bidiagnoserDeafultOptions?.filter((option) =>
          diagnosegrunnlag?.bidiagnoser?.includes(option.value)
        ),
      },
      erNedsettelseIArbeidsevneAvEnVissVarighet: {
        type: 'radio',
        label: erNedsettelseIArbeidsevneAvEnVissVarighetLabel,
        description: 'Om du svarer nei, vil brukeren vurderes for AAP som sykepengeerstatning etter § 11-13.',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneAvEnVissVarighet),
        rules: {
          required: 'Du må svare på om den nedsatte arbeidsevnen er av en viss varighet',
        },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 30 prosent?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 30 prosent.' },
        options: JaEllerNeiOptions,
      },
      erNedsettelseIArbeidsevneMerEnnFørtiProsent: {
        type: 'radio',
        label: 'Er arbeidsevnen nedsatt med minst 40 prosent?',
        defaultValue: getJaNeiEllerUndefined(sykdomsvurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten),
        rules: { required: 'Du må svare på om den nedsatte arbeidsevnen er nedsatt med minst 40 prosent' },
        options: JaEllerNeiOptions,
      },
      yrkesskadeBegrunnelse: {
        type: 'textarea',
        label: '§ 11-22 AAP ved yrkesskade',
        description:
          'Brukeren har en yrkesskade som kan ha betydning for retten til AAP. Du må derfor vurdere om arbeidsevnen er nedsatt med minst 30 prosent. NAY vil vurdere om arbeidsevnen er nedsatt på grunn av yrkesskaden.',
        rules: { required: 'Du må skrive en begrunnelse for om arbeidsevnen er nedsatt med mist 30 prosent' },
        defaultValue: getStringEllerUndefined(sykdomsvurdering?.yrkesskadeBegrunnelse),
      },
    },
    { shouldUnregister: false, readOnly: readOnly }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsBehovOgGåTilNesteSteg({
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
      });
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
    <VilkårsKortMedForm
      heading={'§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng'}
      steg="AVKLAR_SYKDOM"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      visBekreftKnapp={!readOnly}
      vurdertAvAnsatt={sykdomsvurdering?.vurdertAv}
      knappTekst={'Bekreft'}
    >
      {historiskeVurderinger && historiskeVurderinger.length > 0 && (
        <TidligereVurderingerV3 tidligereVurderinger={mapTidligereVurderinger()} />
      )}
      {grunnlag.skalVurdereYrkesskade && (
        <Alert variant={'warning'} size={'small'}>
          Det har blitt funnet én eller flere yrkesskader på brukeren
        </Alert>
      )}
      <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-5" target="_blank">
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
    </VilkårsKortMedForm>
  );

  function mapTidligereVurderinger() {
    const antallVurderinger = historiskeVurderinger.length;
    const finnSluttdato = (index: number) => {
      if (antallVurderinger <= 1 || index === 0) {
        return null;
      }
      const forrigeGjelderFra =
        historiskeVurderinger.at(index - 1)?.vurderingenGjelderFra ||
        historiskeVurderinger.at(index - 1)?.vurdertAv.dato;
      if (!forrigeGjelderFra) {
        return null;
      }
      const vurderingGjelderFra =
        historiskeVurderinger.at(index)?.vurderingenGjelderFra || historiskeVurderinger.at(index)?.vurdertAv.dato!!;

      if (forrigeGjelderFra === vurderingGjelderFra) {
        return format(subDays(parse(vurderingGjelderFra, 'yyyy-MM-dd', new Date()), 0), 'yyyy-MM-dd');
      }

      const tom = erDatoFoerDato(
        formaterDatoForFrontend(vurderingGjelderFra),
        formaterDatoForFrontend(forrigeGjelderFra)
      )
        ? forrigeGjelderFra
        : vurderingGjelderFra;

      return format(subDays(parse(tom, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd');
    };

    const erVurderingenGjeldende = (historiskVurdering: SykdomsGrunnlag['historikkSykdomsvurderinger'][number]) => {
      const vurderingenFinnesSomGjeldende = grunnlag.gjeldendeVedtatteSykdomsvurderinger.some((gjeldendeVurdering) =>
        deepEqual(historiskVurdering, gjeldendeVurdering)
      );
      return vurderingenFinnesSomGjeldende;
    };

    return historiskeVurderinger
      .sort((a, b) => {
        const afom = a.vurderingenGjelderFra ?? a.vurdertAv.dato;
        const bfom = b.vurderingenGjelderFra ?? b.vurdertAv.dato;

        if (afom === bfom) {
          const aGjeldende = erVurderingenGjeldende(a);
          const bGjeldende = erVurderingenGjeldende(b);

          if (aGjeldende && !bGjeldende) return -1;
          if (!aGjeldende && bGjeldende) return 1;
        }

        return sorterEtterNyesteDato(afom, bfom);
      })
      .map((vurdering, index) => ({
        ...vurdering,
        vurdertAvIdent: vurdering.vurdertAv.ident,
        vurdertDato: vurdering.vurdertAv.dato,
        erGjeldendeVurdering: erVurderingenGjeldende(vurdering),
        periode: {
          fom: vurdering.vurderingenGjelderFra ? vurdering.vurderingenGjelderFra : vurdering.vurdertAv.dato,
          tom: finnSluttdato(index),
        },
        felter: [
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
        ],
      }));
  }
};
