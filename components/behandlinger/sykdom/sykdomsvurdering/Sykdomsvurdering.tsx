'use client';

import { Behovstype, getJaNeiEllerUndefined, getStringEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import React, { FormEvent } from 'react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { parseISO } from 'date-fns';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { MellomlagretVurdering, SykdomsGrunnlag, TypeBehandling, VurderingMeta } from 'lib/types/types';
import {
  DiagnoserDefaultOptions,
  hentSisteLagredeVurdering,
} from 'components/behandlinger/sykdom/sykdomsvurdering/diagnoseUtil';
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
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { SykdomsvurderingFormInput } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingFormInput';
import { TidligereSykdomsvurdering } from 'components/behandlinger/sykdom/sykdomsvurdering/TidligereSykdomsvurdering';
import mapTilPeriodisertVurdering from 'components/behandlinger/sykdom/sykdomsvurdering/vurderingMapper';
import { parseOgMigrerMellomlagretData } from 'components/behandlinger/sykdom/sykdomsvurdering/SykdomsvurderingMellomlagringParser';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { Alert, BodyLong, Link, VStack } from '@navikt/ds-react';
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

export interface Sykdomsvurdering extends VurderingMeta {
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
}

interface SykdomProps {
  behandlingVersjon: number;
  grunnlag: SykdomsGrunnlag;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  diagnoseDefaultOptions: DiagnoserDefaultOptions;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  erOvergangArbeid: boolean;
}

export const Sykdomsvurdering = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  diagnoseDefaultOptions,
  typeBehandling,
  initialMellomlagretVurdering,
  erOvergangArbeid,
}: SykdomProps) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { sak } = useSak();

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_SYKDOM');

  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_SYKDOM',
    initialMellomlagretVurdering
  );

  const defaultValues: SykdomsvurderingerForm = initialMellomlagretVurdering
    ? parseOgMigrerMellomlagretData(initialMellomlagretVurdering.data)
    : mapGrunnlagTilDefaultvalues(grunnlag);

  const form = useForm<SykdomsvurderingerForm>({ defaultValues });
  const {
    fields: nyeVurderingerFields,
    remove,
    append,
  } = useFieldArray({ name: 'vurderinger', control: form.control });

  const { slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_SYKDOM_KODE,
    initialMellomlagretVurdering,
    form
  );

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
          referanse: behandlingsreferanse,
        },
        () => {
          closeAllAccordions();
          visningActions.onBekreftClick();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  const errorList = hentFeilmeldingerForForm(form.formState.errors);
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const foersteNyePeriode = nyeVurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

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
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag)))}
      visningActions={visningActions}
      visningModus={visningModus}
      formReset={() => form.reset(mapGrunnlagTilDefaultvalues(grunnlag))}
      onLeggTilVurdering={() => append(emptySykdomsvurdering(utledDiagnoserForNyVurdering()))}
      errorList={errorList}
    >
      <VStack gap={'4'}>
        <BodyLong size={'small'}>
          <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_7-1" target="_blank">
            Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-5 (lovdata.no)
          </Link>
        </BodyLong>

        {erOvergangArbeid && (
          <Alert variant={'info'} size={'small'}>
            Hvis brukeren skal ha AAP i perioden som arbeidssøker etter § 11-17, må du først vurdere at arbeidsevnen
            ikke lenger er nedsatt etter § 11-5 og at brukeren er satt i stand til å skaffe seg arbeid som han eller hun
            kan utføre.
          </Alert>
        )}

        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={crypto.randomUUID()}
            fom={new Dato(vurdering.fom).dato}
            tom={vurdering.tom ? parseISO(vurdering.tom) : undefined}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(erTidligereVurderingOppfylt(vurdering))}
            defaultCollapsed={nyeVurderingerFields.length > 0}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
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
            vurdering={vurdering}
            readonly={formReadOnly}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            onSlettVurdering={() => remove(index)}
            harTidligereVurderinger={vedtatteVurderinger.length > 0}
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
              diagnoseDefaultOptions={diagnoseDefaultOptions}
            />
          </NyVurderingExpandableCard>
        ))}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function mapGrunnlagTilDefaultvalues(grunnlag: SykdomsGrunnlag): SykdomsvurderingerForm {
    const diagnoserForNyVurdering = utledDiagnoserForNyVurdering();

    if (trengerVurderingsForslag(grunnlag)) {
      return hentPerioderSomTrengerVurdering<Sykdomsvurdering>(grunnlag, () =>
        emptySykdomsvurdering(diagnoserForNyVurdering)
      );
    }

    // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
    return {
      vurderinger: grunnlag.nyeVurderinger.map((vurdering) => {
        const kodeverk = vurdering?.kodeverk as keyof DiagnoserDefaultOptions;

        const hoveddiagnose = kodeverk
          ? diagnoseDefaultOptions?.[kodeverk]?.hoveddiagnoserOptions.find(
              (value) => value.value === vurdering?.hoveddiagnose
            )
          : undefined;

        const bidiagnose = kodeverk
          ? diagnoseDefaultOptions?.[kodeverk].bidiagnoserOptions?.filter((option) =>
              vurdering?.bidiagnoser?.includes(option.value)
            )
          : undefined;

        return {
          fraDato: new Dato(vurdering.vurderingenGjelderFra || vurdering.fom).formaterForFrontend(),
          begrunnelse: vurdering?.begrunnelse,
          harSkadeSykdomEllerLyte: getJaNeiEllerUndefined(vurdering?.harSkadeSykdomEllerLyte)!,
          erArbeidsevnenNedsatt: getJaNeiEllerUndefined(vurdering?.erArbeidsevnenNedsatt),
          erNedsettelseIArbeidsevneMerEnnHalvparten: getJaNeiEllerUndefined(
            vurdering?.erNedsettelseIArbeidsevneMerEnnHalvparten
          ),
          erSkadeSykdomEllerLyteVesentligdel: getJaNeiEllerUndefined(vurdering?.erSkadeSykdomEllerLyteVesentligdel),
          kodeverk: getStringEllerUndefined(vurdering.kodeverk),
          hoveddiagnose: hoveddiagnose,
          bidiagnose: bidiagnose,
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
          erNyVurdering: false,
          behøverVurdering: false,
        };
      }),
    };
  }

  function utledDiagnoserForNyVurdering() {
    const sisteLagredeVurdering = hentSisteLagredeVurdering(typeBehandling, grunnlag);
    const kodeverk = sisteLagredeVurdering?.kodeverk as keyof DiagnoserDefaultOptions;

    if (kodeverk) {
      const hoveddiagnose = diagnoseDefaultOptions[kodeverk]?.hoveddiagnoserOptions.find(
        (option) => option.value === sisteLagredeVurdering?.hoveddiagnose
      );

      const bidiagnose = diagnoseDefaultOptions?.[kodeverk].bidiagnoserOptions.filter((option) =>
        sisteLagredeVurdering?.bidiagnoser?.includes(option.value)
      );

      return { kodeverk, hoveddiagnose, bidiagnose };
    }

    return undefined;
  }
};
