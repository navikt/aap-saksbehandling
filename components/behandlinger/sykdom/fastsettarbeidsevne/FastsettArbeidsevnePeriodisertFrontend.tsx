'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { useFieldArray, useForm } from 'react-hook-form';
import { gyldigDatoEllerNull, validerDato } from 'lib/validation/dateValidation';
import {
  ArbeidsevneGrunnlag,
  MellomlagretVurdering,
  PeriodisertArbeidsevneVurderingDto,
  VurdertAvAnsatt,
} from 'lib/types/types';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { Behovstype } from 'lib/utils/form';
import { parse, parseISO } from 'date-fns';

import { BodyLong, HStack, Label, Link, VStack } from '@navikt/ds-react';
import { pipe } from 'lib/utils/functional';
import { erProsent, validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { TextAreaWrapper } from 'components/form/textareawrapper/TextAreaWrapper';
import { TextFieldWrapper } from 'components/form/textfieldwrapper/TextFieldWrapper';
import { DateInputWrapper } from 'components/form/dateinputwrapper/DateInputWrapper';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import React from 'react';
import { HvordanLeggeTilSluttdatoReadMore } from 'components/hvordanleggetilsluttdatoreadmore/HvordanLeggeTilSluttdatoReadMore';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';

interface Props {
  grunnlag: ArbeidsevneGrunnlag;
  behandlingVersjon: number;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

interface ArbeidsevneVurderingForm {
  begrunnelse: string;
  arbeidsevne: number | undefined;
  fraDato: string | undefined;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
}

interface FastsettArbeidsevneForm {
  vurderinger: ArbeidsevneVurderingForm[];
}

const ANTALL_TIMER_FULL_UKE = 37.5;

const prosentTilTimer = (prosent: string): number => (Number.parseInt(prosent, 10) / 100) * ANTALL_TIMER_FULL_UKE;
const rundNedTilNaermesteHalve = (tall: number): number => Math.floor(tall * 2) / 2;
const tilNorskDesimalFormat = (tall: number): string => tall.toLocaleString('no-NB');
const tilAvrundetTimetall = pipe<string>(prosentTilTimer, rundNedTilNaermesteHalve, tilNorskDesimalFormat);

const regnOmTilTimer = (value: string) => {
  if (!value) {
    return undefined;
  }
  return `(${tilAvrundetTimetall(value)} timer)`;
};

export const FastsettArbeidsevnePeriodisertFrontend = ({
  grunnlag,
  behandlingVersjon,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('FASTSETT_ARBEIDSEVNE');

  const { mellomlagretVurdering, lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.FASTSETT_ARBEIDSEVNE_KODE, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'FASTSETT_ARBEIDSEVNE',
    mellomlagretVurdering
  );

  const nyeVurderinger = grunnlag?.nyeVurderinger ?? [];

  const defaultValues =
    initialMellomlagretVurdering != null
      ? (JSON.parse(initialMellomlagretVurdering.data) as FastsettArbeidsevneForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<FastsettArbeidsevneForm>({
    defaultValues,
  });

  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: fields.length === 0 ? formaterDatoForFrontend(new Date()) : undefined,
      arbeidsevne: undefined,
      erNyVurdering: true,
    });
  }

  function onSubmit(data: FastsettArbeidsevneForm) {
    const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
      form,
      nyeVurderinger: data.vurderinger,
      grunnlag,
      tidligsteDatoMåMatcheMedRettighetsperiode: false,
    });
    if (!erPerioderGyldige) {
      return;
    }

    if (data.vurderinger.length === 0 && nyeVurderinger.length === 0) {
      visningActions.onBekreftClick();
      return;
    }
    const losning: LøsningerForPerioder = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.FASTSETT_ARBEIDSEVNE_KODE,
        løsningerForPerioder: data.vurderinger.map((periode, index) => {
          const isLast = index === data.vurderinger.length - 1;
          const tilDato = isLast
            ? undefined
            : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);
          return mapFormTilDto(periode, tilDato != null ? formaterDatoForBackend(tilDato) : undefined);
        }),
      },
    };

    løsPeriodisertBehovOgGåTilNesteSteg(losning, () => {
      nullstillMellomlagretVurdering();
      closeAllAccordions();
      visningActions.onBekreftClick();
    });
  }

  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<FastsettArbeidsevneForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet (valgfritt)'}
      steg={'FASTSETT_ARBEIDSEVNE'}
      vilkårTilhørerNavKontor={true}
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={onAddPeriode}
      errorList={errorList}
    >
      {!formReadOnly && (
        <VStack paddingBlock={'4'}>
          <BodyLong size={'small'}>
            <Link href={'https://lovdata.no/pro/rundskriv/r11-00/KAPITTEL_26-3'} target="_blank">
              Du kan lese hvordan vilkåret skal vurderes i rundskrivet til § 11-23 (lovdata.no)
            </Link>
          </BodyLong>
        </VStack>
      )}
      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          vurderingStatus={getErOppfyltEllerIkkeStatus(vurdering.arbeidsevne > 0)}
          vurdertAv={vurdering.vurdertAv}
        >
          <VStack gap={'5'}>
            <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(vurdering.fom)} />
            <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
            <SpørsmålOgSvar
              spørsmål="Oppgi arbeidsevnen som ikke er utnyttet i prosent"
              svar={vurdering.arbeidsevne.toString()}
            />
          </VStack>
        </TidligereVurderingExpandableCard>
      ))}

      {fields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          accordionsSignal={accordionsSignal}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          vurderingStatus={undefined}
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vedtatteVurderinger.length - 1}
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          besluttetAv={vurdering.besluttetAv}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          readonly={formReadOnly}
          onSlettVurdering={() => remove(index)}
          // vilkåret er valgfritt, kan derfor slette vurderingen selv om det ikke finnes en tidligere vurdering
          harTidligereVurderinger={true}
          index={index}
          initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
        >
          <DateInputWrapper
            control={form.control}
            name={`vurderinger.${index}.fraDato`}
            label={'Vurderingen gjelder fra'}
            rules={{
              required: 'Vennligst velg en dato for når vurderingen gjelder fra',
              validate: (value) => validerDato(value as string),
            }}
            readOnly={formReadOnly}
          />

          <HvordanLeggeTilSluttdatoReadMore />

          <TextAreaWrapper
            label={'Vilkårsvurdering'}
            description={
              'Vurder om brukeren har en arbeidsevne som ikke er utnyttet. Hvis det ikke legges inn en vurdering, har brukeren rett på full ytelse.'
            }
            control={form.control}
            name={`vurderinger.${index}.begrunnelse`}
            rules={{ required: 'Du må begrunne vurderingen din' }}
            className={'begrunnelse'}
            readOnly={formReadOnly}
          />
          <HStack gap={'3'}>
            <VStack gap={'2'}>
              <Label size={'small'}>Oppgi arbeidsevnen som ikke er utnyttet i prosent</Label>
              <HStack gap={'2'}>
                <TextFieldWrapper
                  control={form.control}
                  name={`vurderinger.${index}.arbeidsevne`}
                  type={'text'}
                  label={'Oppgi arbeidsevnen som ikke er utnyttet i prosent'}
                  hideLabel={true}
                  rules={{
                    required: 'Du må angi hvor stor arbeidsevne brukeren har',
                    validate: (value) => {
                      const valueAsNumber = Number(value);
                      if (isNaN(valueAsNumber)) {
                        return 'Prosent må være et tall';
                      } else if (!erProsent(valueAsNumber)) {
                        return 'Prosent kan bare være mellom 0 og 100';
                      }
                    },
                  }}
                  readOnly={formReadOnly}
                  className="prosent_input"
                />
                <VStack paddingBlock={'1'} justify={'end'}>
                  {regnOmTilTimer(form.watch(`vurderinger.${index}.arbeidsevne`)?.toString() ?? '')}
                </VStack>
              </HStack>
            </VStack>
          </HStack>
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};

function getDefaultValuesFromGrunnlag(grunnlag: ArbeidsevneGrunnlag | undefined): FastsettArbeidsevneForm {
  if (grunnlag == null || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
    // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom array med vurderinger
    return {
      vurderinger: [],
    };
  }

  // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
  return {
    vurderinger: grunnlag?.nyeVurderinger.map((vurdering) => ({
      begrunnelse: vurdering.begrunnelse,
      fraDato: formaterDatoForFrontend(vurdering.fom),
      arbeidsevne: vurdering.arbeidsevne,
      vurdertAv: vurdering.vurdertAv,
      kvalitetssikretAv: vurdering.kvalitetssikretAv,
      besluttetAv: vurdering.besluttetAv,
    })),
  };
}
function mapFormTilDto(
  periodeForm: ArbeidsevneVurderingForm,
  tilDato: string | undefined | null
): PeriodisertArbeidsevneVurderingDto {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    arbeidsevne: periodeForm.arbeidsevne ?? 0,
  };
}
