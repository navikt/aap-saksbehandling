'use client';

import { Behovstype, getJaNeiEllerUndefined, getStringEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { parseISO } from 'date-fns';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { MellomlagretVurdering, SykdomsGrunnlag, TypeBehandling, VurdertAvAnsatt } from 'lib/types/types';
import { finnDiagnosegrunnlag } from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
import { ValuePair } from 'components/form/FormField';
import { useSak } from 'hooks/SakHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { Dato } from 'lib/types/Dato';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { SykdomsvurderingFormInput } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';
import { TidligereSykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/TidligereSykdomsvurdering';
import mapTilPeriodisertVurdering from 'components/behandlinger/sykdom/sykdomsvurdering/periodisertVurderingMapper';
import { parseOgMigrerMellomlagretData } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMellomlagringParser';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { BodyLong, Link, VStack } from '@navikt/ds-react';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import {
  emptySykdomsvurdering,
  erNyVurderingOppfylt,
  erTidligereVurderingOppfylt,
} from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';

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
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
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

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { slettMellomlagring, lagreMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_SYKDOM_KODE, initialMellomlagretVurdering);

  const diagnosegrunnlag = finnDiagnosegrunnlag(typeBehandling, grunnlag);

  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
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

  const førsteDatoSomKanVurderes =
    grunnlag.kanVurderes[0]?.fom != null ? parseISO(grunnlag.kanVurderes[0].fom) : new Date();

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
                førsteDatoSomKanVurderes,
                tilDato ? formaterDatoForBackend(tilDato) : undefined
              );
            }),
          },
          referanse: behandlingsReferanse,
        },
        () => {
          closeAllAccordions();
          visningActions.onBekreftClick();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  const errorList = mapPeriodiserteVurderingerErrorList<SykdomsvurderingerForm>(form.formState.errors);
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

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
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag)))}
      visningActions={visningActions}
      visningModus={visningModus}
      formReset={() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag))}
      onLeggTilVurdering={() => append(emptySykdomsvurdering(utledDiagnoserForVurdering()))}
      errorList={errorList}
    >
      <VStack gap={'4'}>
        <BodyLong size={'small'}>
          <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1" target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
          </Link>
        </BodyLong>

        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={vurdering.fom}
            fom={new Dato(vurdering.fom).dato}
            tom={vurdering.tom ? parseISO(vurdering.tom) : undefined}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(erTidligereVurderingOppfylt(vurdering))}
            defaultCollapsed={nyeVurderingerFields.length > 0}
            vurdertAv={vurdering.vurdertAv}
          >
            <TidligereSykdomsvurdering vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}

        {nyeVurderingerFields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            accordionsSignal={accordionsSignal}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            vurderingStatus={getErOppfyltEllerIkkeStatus(
              erNyVurderingOppfylt(
                form.watch(`vurderinger.${index}`),
                førsteDatoSomKanVurderes,
                grunnlag.skalVurdereYrkesskade
              )
            )}
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === nyeVurderingerFields.length - 1}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
            readonly={formReadOnly}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            onSlettVurdering={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
            initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
          >
            <SykdomsvurderingFormInput
              index={index}
              form={form}
              readonly={formReadOnly}
              sak={sak}
              erÅrsakssammenhengYrkesskade={grunnlag.erÅrsakssammenhengYrkesskade}
              skalVurdereYrkesskade={grunnlag.skalVurdereYrkesskade}
              rettighetsperiodeStartdato={førsteDatoSomKanVurderes}
            />
          </NyVurderingExpandableCard>
        ))}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function utledDiagnoserForVurdering() {
    const kodeverk = getStringEllerUndefined(diagnosegrunnlag?.kodeverk);
    const hoveddiagnose = hoveddiagnoseDefaultOptions?.find((value) => value.value === diagnosegrunnlag?.hoveddiagnose);
    const bidiagnose = bidiagnoserDeafultOptions?.filter((option) =>
      diagnosegrunnlag?.bidiagnoser?.includes(option.value)
    );

    return { kodeverk, hoveddiagnose, bidiagnose };
  }

  function mapGrunnlagTilDefaultvalues(grunnlag: SykdomsGrunnlag): SykdomsvurderingerForm {
    const diagnoser = utledDiagnoserForVurdering();

    if (trengerVurderingsForslag(grunnlag)) {
      return hentPerioderSomTrengerVurdering<Sykdomsvurdering>(grunnlag, () => emptySykdomsvurdering(diagnoser));
    }

    // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
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
        kodeverk: diagnoser.kodeverk,
        hoveddiagnose: diagnoser.hoveddiagnose,
        bidiagnose: diagnoser.bidiagnose,
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
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
      })),
    };
  }
};
