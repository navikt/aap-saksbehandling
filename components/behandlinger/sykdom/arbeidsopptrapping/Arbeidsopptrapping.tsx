'use client';

import {
  ArbeidsopptrappingGrunnlagResponse,
  ArbeidsopptrappingLøsningDto,
  MellomlagretVurdering,
  VurdertAvAnsatt,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { parse, parseISO } from 'date-fns';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { ArbeidsopptrappingVurderingFormInput } from 'components/behandlinger/sykdom/arbeidsopptrapping/ArbeidsopptrappingVurderingFormInput';
import { Link, VStack } from '@navikt/ds-react';
import { SpørsmålOgSvar } from 'components/sporsmaalogsvar/SpørsmålOgSvar';
import { IkkeVurderbarPeriode } from 'components/periodisering/IkkeVurderbarPeriode';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { useState } from 'react';
import { AccordionTilstandProvider } from 'context/saksbehandling/AccordionTilstandContext';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: ArbeidsopptrappingGrunnlagResponse;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface ArbeidsopptrappingForm {
  vurderinger: ArbeidsopptrappingVurderingForm[];
}

export interface ArbeidsopptrappingVurderingForm {
  begrunnelse: string;
  fraDato: string | undefined;
  reellMulighetTilOpptrapping: JaEllerNei | undefined;
  rettPaaAAPIOpptrapping: JaEllerNei | undefined;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
  erNyVurdering?: boolean;
}

export const Arbeidsopptrapping = ({ behandlingVersjon, readOnly, grunnlag, initialMellomlagretVurdering }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('ARBEIDSOPPTRAPPING');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.ARBEIDSOPPTRAPPING_KODE, initialMellomlagretVurdering);

  const [isOpen, setIsOpen] = useState<boolean>();

  const { visningActions, visningModus, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'ARBEIDSOPPTRAPPING',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as ArbeidsopptrappingForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<ArbeidsopptrappingForm>({
    defaultValues,
  });

  const nyeVurderinger = grunnlag?.nyeVurderinger ?? [];

  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const ikkeVurderbarePerioder = grunnlag?.ikkeVurderbarePerioder ?? [];

  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: fields.length === 0 ? formaterDatoForFrontend(new Date()) : undefined,
      reellMulighetTilOpptrapping: undefined,
      rettPaaAAPIOpptrapping: undefined,
      erNyVurdering: true,
    });
  }

  function onSubmit(data: ArbeidsopptrappingForm) {
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
        behovstype: Behovstype.ARBEIDSOPPTRAPPING_KODE,
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
      visningActions.onBekreftClick();
      setIsOpen(false);
      nullstillMellomlagretVurdering();
    });
  }

  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<LovOgMedlemskapVurderingForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-23 sjette ledd. Arbeidsopptrapping (valgfritt)'}
      steg={'ARBEIDSOPPTRAPPING'}
      onSubmit={form.handleSubmit(onSubmit)}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      isLoading={isLoading}
      status={status}
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
          <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_26-7" target="_blank">
            Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-23 (lovdata.no)
          </Link>
        </VStack>
      )}
      {ikkeVurderbarePerioder.map((vurdering) => (
        <IkkeVurderbarPeriode
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          alertMelding={
            'Vilkåret kan ikke vurderes for denne perioden. For å vurdere vilkåret må §§ 11-5 og 11-6 være oppfylt.'
          }
          foersteNyePeriodeFraDato={undefined}
        ></IkkeVurderbarPeriode>
      ))}
      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={vurdering.reellMulighetTilOpptrapping && vurdering.rettPaaAAPIOpptrapping}
        >
          <VStack gap={'5'}>
            <SpørsmålOgSvar spørsmål="Vurderingen gjelder fra?" svar={formaterDatoForFrontend(vurdering.fom)} />
            <SpørsmålOgSvar spørsmål="Vilkårsvurdering" svar={vurdering.begrunnelse} />
            <SpørsmålOgSvar
              spørsmål="Har brukeren en reell mulighet til å trappe opp til en 100% stilling?"
              svar={getJaNeiEllerUndefined(vurdering.reellMulighetTilOpptrapping)!}
            />
            <SpørsmålOgSvar
              spørsmål="Har brukeren rett på AAP i arbeidsopptrapping etter § 11-23 6. ledd?"
              svar={getJaNeiEllerUndefined(vurdering.rettPaaAAPIOpptrapping)!}
            />
          </VStack>
        </TidligereVurderingExpandableCard>
      ))}

      <AccordionTilstandProvider isOpen={isOpen} setIsOpen={setIsOpen}>
        {fields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            oppfylt={
              form.watch(`vurderinger.${index}.reellMulighetTilOpptrapping`) &&
              form.watch(`vurderinger.${index}.rettPaaAAPIOpptrapping`)
                ? form.watch(`vurderinger.${index}.reellMulighetTilOpptrapping`) === JaEllerNei.Ja &&
                  form.watch(`vurderinger.${index}.rettPaaAAPIOpptrapping`) === JaEllerNei.Ja
                : undefined
            }
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === fields.length - 1}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            onSlettVurdering={() => remove(index)}
            readonly={formReadOnly}
            harTidligereVurderinger={true}
            index={index}
            initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
          >
            <ArbeidsopptrappingVurderingFormInput
              index={index}
              form={form}
              readonly={formReadOnly}
              ikkeRelevantePerioder={grunnlag?.ikkeVurderbarePerioder}
            />
          </NyVurderingExpandableCard>
        ))}
      </AccordionTilstandProvider>
    </VilkårskortPeriodisert>
  );
};

function getDefaultValuesFromGrunnlag(
  grunnlag: ArbeidsopptrappingGrunnlagResponse | undefined
): ArbeidsopptrappingForm {
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
      reellMulighetTilOpptrapping: getJaNeiEllerUndefined(vurdering.reellMulighetTilOpptrapping),
      rettPaaAAPIOpptrapping: getJaNeiEllerUndefined(vurdering.rettPaaAAPIOpptrapping),
      vurdertAv: vurdering.vurdertAv,
      kvalitetssikretAv: vurdering.kvalitetssikretAv,
      besluttetAv: vurdering.besluttetAv,
    })),
  };
}

function mapFormTilDto(
  periodeForm: ArbeidsopptrappingVurderingForm,
  tilDato: string | undefined | null
): ArbeidsopptrappingLøsningDto {
  return {
    begrunnelse: periodeForm.begrunnelse,
    fom: formaterDatoForBackend(parse(periodeForm.fraDato!, 'dd.MM.yyyy', new Date())),
    tom: tilDato,
    reellMulighetTilOpptrapping: periodeForm.reellMulighetTilOpptrapping === JaEllerNei.Ja,
    rettPaaAAPIOpptrapping: periodeForm.rettPaaAAPIOpptrapping === JaEllerNei.Ja,
  };
}
