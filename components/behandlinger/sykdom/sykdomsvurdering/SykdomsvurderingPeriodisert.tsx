'use client';

import { Behovstype, getJaNeiEllerUndefined, getStringEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent, useCallback } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { parseISO } from 'date-fns';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { MellomlagretVurdering, SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { ValuePair } from 'components/form/FormField';
import { useSak } from 'hooks/SakHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useFieldArray, useForm } from 'react-hook-form';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { Dato } from 'lib/types/Dato';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { SykdomsvurderingFormInput } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';
import { TidligereSykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/TidligereSykdomsvurdering';
import mapTilPeriodisertVurdering from 'components/behandlinger/sykdom/sykdomsvurdering/periodisertVurderingMapper';
import { parseOgMigrerMellomlagretData } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMellomlagringParser';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { Link, VStack } from '@navikt/ds-react';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';

export interface SykdomsvurderingerForm {
  vurderinger: Array<Sykdomsvurdering>;
}

export interface Sykdomsvurdering {
  fraDato: string;
  begrunnelse: string;
  vurderingenGjelderFra?: string;
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
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
}

interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  bidiagnoserDeafultOptions?: ValuePair[];
  hoveddiagnoseDefaultOptions?: ValuePair[];
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const SykdomsvurderingPeriodisert = ({
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
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { slettMellomlagring, lagreMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_SYKDOM_KODE, initialMellomlagretVurdering);

  const diagnosegrunnlag = finnDiagnosegrunnlag(typeBehandling, grunnlag);

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_SYKDOM',
    mellomlagretVurdering
  );

  const defaultValues: SykdomsvurderingerForm = mellomlagretVurdering
    ? parseOgMigrerMellomlagretData(mellomlagretVurdering.data)
    : mapGrunnlagTilDefaultvalues(grunnlag);

  const form = useForm<SykdomsvurderingerForm>({ defaultValues });
  const {
    fields: nyeVurderingerFields,
    remove,
    append,
  } = useFieldArray({ name: 'vurderinger', control: form.control });

  const behandlingErRevurdering = typeBehandling === 'Revurdering';
  const behandlingErFørstegangsbehandling = typeBehandling === 'Førstegangsbehandling';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
        form,
        nyeVurderinger: data.vurderinger,
        grunnlag,
        vurderingerKanIkkeVæreFørKanVurderes: true,
      });
      if (!erPerioderGyldige) {
        return;
      }
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SYKDOM_KODE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const isLast = index === data.vurderinger.length - 1;
              const tilDato = isLast
                ? undefined
                : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);
              return mapTilPeriodisertVurdering(
                vurdering,
                grunnlag.skalVurdereYrkesskade,
                grunnlag.erÅrsakssammenhengYrkesskade,
                behandlingErFørstegangsbehandling,
                behandlingErRevurdering,
                behandlingErRevurderingAvFørstegangsbehandling(),
                tilDato ? formaterDatoForBackend(tilDato) : undefined
              );
            }),
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

  const førsteFraDato = form.watch(`vurderinger.0.fraDato`);

  const behandlingErRevurderingAvFørstegangsbehandling = useCallback(() => {
    //TODO: gjenkjennelse av revurdering av førstegangsbehandling må gås opp for periodiserte vurderinger
    return false;

    //   const førsteFraDatoSomSkalVurderes = stringToDate(førsteFraDato, DATO_FORMATER.ddMMyyyy);
    //   if (!behandlingErRevurdering || !førsteFraDatoSomSkalVurderes) {
    //     return false;
    //   }
    //   const søknadsdato = startOfDay(new Date(sak.periode.fom));
    //   return søknadsdato.getTime() >= startOfDay(førsteFraDatoSomSkalVurderes).getTime();
  }, [behandlingErRevurdering, sak, førsteFraDato]);

  const errorList = mapPeriodiserteVurderingerErrorList<SykdomsvurderingerForm>(form.formState.errors);
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  function erVurderingOppfylt(vurdering: Sykdomsvurdering): boolean | undefined {
    if (
      vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten === JaEllerNei.Ja ||
      vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense === JaEllerNei.Ja
    ) {
      return true;
    }
  }

  const foersteNyePeriode = nyeVurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng'}
      steg="AVKLAR_SYKDOM"
      vilkårTilhørerNavKontor={true}
      onSubmit={handleSubmit}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      knappTekst={'Bekreft'}
      kvalitetssikretAv={grunnlag.kvalitetssikretAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag)))}
      visningActions={visningActions}
      visningModus={visningModus}
      formReset={() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag))}
      onLeggTilVurdering={() => append(emptySykdomsvurdering())}
      errorList={errorList}
    >
      <VStack gap={'4'}>
        <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1" target="_blank">
          Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
        </Link>
        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={vurdering.fom}
            fom={new Dato(vurdering.fom).dato}
            tom={vurdering.tom ? parseISO(vurdering.tom) : undefined}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            oppfylt={
              getJaNeiEllerUndefined(vurdering.erNedsettelseIArbeidsevneMerEnnHalvparten) === JaEllerNei.Ja ||
              getJaNeiEllerUndefined(vurdering.erNedsettelseIArbeidsevneMerEnnYrkesskadeGrense) === JaEllerNei.Ja
            }
            defaultCollapsed={nyeVurderingerFields.length > 0}
          >
            <TidligereSykdomsvurdering vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}
        {nyeVurderingerFields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            oppfylt={erVurderingOppfylt(form.watch(`vurderinger.${index}`))}
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === nyeVurderingerFields.length - 1}
            vurdertAv={vurdering.vurdertAv}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            readonly={formReadOnly}
            onRemove={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
          >
            <SykdomsvurderingFormInput
              index={index}
              form={form}
              readonly={formReadOnly}
              typeBehandling={typeBehandling}
              sak={sak}
              erÅrsakssammenhengYrkesskade={grunnlag.erÅrsakssammenhengYrkesskade}
              skalVurdereYrkesskade={grunnlag.skalVurdereYrkesskade}
              erRevurderingAvFørstegangsbehandling={behandlingErRevurderingAvFørstegangsbehandling()}
            />
          </NyVurderingExpandableCard>
        ))}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function mapGrunnlagTilDefaultvalues(grunnlag: SykdomsGrunnlag): SykdomsvurderingerForm {
    if (grunnlag == null || grunnlag.nyeVurderinger.length === 0) {
      // Vi har ingen nye vurderinger, legg til en tom-default-periode
      const førsteFraDatoSomKanVurderes = grunnlag.kanVurderes[0]?.fom
        ? { fraDato: new Dato(grunnlag.kanVurderes[0].fom).formaterForFrontend() }
        : {};
      return {
        vurderinger: [
          {
            ...emptySykdomsvurdering(),
            ...førsteFraDatoSomKanVurderes,
          },
        ],
      };
    }
    return {
      vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
        fraDato: new Dato(vurdering.vurderingenGjelderFra || vurdering.fom).formaterForFrontend(),
        begrunnelse: vurdering?.begrunnelse,
        harSkadeSykdomEllerLyte: getJaNeiEllerUndefined(vurdering?.harSkadeSykdomEllerLyte)!,
        erArbeidsevnenNedsatt: getJaNeiEllerUndefined(vurdering?.erArbeidsevnenNedsatt),
        erNedsettelseIArbeidsevneMerEnnHalvparten: getJaNeiEllerUndefined(
          vurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten
        ),
        erSkadeSykdomEllerLyteVesentligdel: getJaNeiEllerUndefined(vurdering?.erSkadeSykdomEllerLyteVesentligdel),
        kodeverk: getStringEllerUndefined(diagnosegrunnlag?.kodeverk),
        hoveddiagnose: hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose),
        bidiagnose: bidiagnoserDeafultOptions?.filter((option) =>
          diagnosegrunnlag?.bidiagnoser?.includes(option.value)
        ),
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
        vurdertAv:
          vurdering.vurdertAv != null
            ? {
                ansattnavn: vurdering.vurdertAv.ansattnavn,
                ident: vurdering.vurdertAv.ident,
                dato: vurdering.vurdertAv.dato,
              }
            : undefined,
      })),
    };
  }
};

function emptySykdomsvurdering(): Sykdomsvurdering {
  return {
    fraDato: '',
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
