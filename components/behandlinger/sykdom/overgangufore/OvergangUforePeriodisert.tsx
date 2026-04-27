'use client';

import {
  BistandVurderingResponse,
  MellomlagretVurdering,
  OvergangUforeGrunnlag,
  OvergangUføreVedtakResultat,
  VurderingMeta,
} from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import React, { FormEvent } from 'react';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { formaterDatoForBackend, formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { parse, parseISO } from 'date-fns';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { OvergangUforeVurderingFormInput } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeVurderingFormInput';
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { OvergangUforeTidligereVurdering } from 'components/behandlinger/sykdom/overgangufore/OvergangUforeTidligereVurdering';
import { BodyLong, Link, VStack } from '@navikt/ds-react';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { IkkeVurderbarPeriode } from 'components/periodisering/IkkeVurderbarPeriode';
import { erTidligereVurderingOppfylt } from 'components/behandlinger/sykdom/sykdomsvurdering/sykdomsvurdering-utils';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: OvergangUforeGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface OvergangUforeForm {
  vurderinger: Array<OvergangUforeVurderingForm>;
}
interface OvergangUforeVurderingForm extends VurderingMeta {
  fraDato: string;
  begrunnelse: string;
  brukerHarSøktUføretrygd: JaEllerNei | undefined;
  brukerHarFåttVedtakOmUføretrygd: OvergangUføreVedtakResultat | null;
  brukerRettPåAAP?: JaEllerNei | undefined;
}

export const OvergangUforePeriodisert = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_UFORE');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'OVERGANG_UFORE',
    initialMellomlagretVurdering
  );

  const defaultValues: OvergangUforeForm = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<OvergangUforeForm>({ defaultValues });
  const { fields: nyeVurderingFields, remove, append } = useFieldArray({ name: 'vurderinger', control: form.control });

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.OVERGANG_UFORE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          referanse: behandlingsreferanse,
          behov: {
            behovstype: Behovstype.OVERGANG_UFORE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const isLast = index === data.vurderinger.length - 1;
              const tilDato = isLast
                ? undefined
                : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);
              return {
                fom: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
                tom: tilDato ? formaterDatoForBackend(tilDato) : undefined,
                begrunnelse: vurdering.begrunnelse,
                brukerHarSøktOmUføretrygd: vurdering.brukerHarSøktUføretrygd === JaEllerNei.Ja,
                brukerHarFåttVedtakOmUføretrygd: vurdering.brukerHarFåttVedtakOmUføretrygd,
                brukerRettPåAAP: vurdering.brukerRettPåAAP === JaEllerNei.Ja,
              };
            }),
          },
        },
        () => {
          visningActions.onBekreftClick();
          closeAllAccordions();
          nullstillMellomlagretVurdering();
        }
      );
    })(event);
  };

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = nyeVurderingFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  const nyeVurderingerSykdom = grunnlag.gjeldendeSykdsomsvurderinger ?? [];
  const vurderingerBistandsbehov = grunnlag.gjeldendeBistandsbehovVurderinger ?? [];

  // TODO: Kan det være flere vurderinger her med forskjellige resultater? Hva skjer da?
  const sisteVurderingSykdom = nyeVurderingerSykdom?.at(nyeVurderingerSykdom.length - 1);
  //const sisteVurderingOvergangArbeid = vurderingerBistandsbehov?.at(vurderingerBistandsbehov.length - 1);
  const skalStegVurderes =
    sisteVurderingSykdom == undefined
      ? false
      : erTidligereVurderingOppfylt(sisteVurderingSykdom) &&
        erBistandsbehoveneAvklart(vurderingerBistandsbehov) &&
        !erBistandsbehoveneOppfylt(vurderingerBistandsbehov);

  console.log('nyeVurderingerSykdom: ', nyeVurderingerSykdom);
  console.log('vurderingerBistandsbehov: ', vurderingerBistandsbehov);
  console.log('grunnlag.gjeldendeBistandsbehovVurderinger: ', grunnlag.gjeldendeBistandsbehovVurderinger);
  console.log('erBistandsbehoveneOppfylt: ', erBistandsbehoveneOppfylt(grunnlag.gjeldendeBistandsbehovVurderinger));
  console.log('Skal vise endreknapp: ', skalStegVurderes);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-18 AAP under behandling av krav om uføretrygd'}
      steg={'OVERGANG_UFORE'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={() => append(emptyOvergangUføreVurdering())}
      errorList={errorList}
      skalViseEndreKnapp={skalStegVurderes}
    >
      <VStack gap={'space-16'}>
        <BodyLong size={'small'}>
          <Link href="https://lovdata.no/pro/lov/1997-02-28-19/%C2%A711-18" target="_blank">
            Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-18
          </Link>
        </BodyLong>

        {grunnlag.ikkeRelevantePerioder.map((periode) => (
          <IkkeVurderbarPeriode
            key={crypto.randomUUID()}
            fom={parseISO(periode.fom)}
            tom={periode.tom != null ? parseISO(periode.tom) : null}
            alertMelding={
              'Vilkåret kan ikke vurderes for denne perioden. For å vurdere vilkåret må § 11-5 være oppfylt, og § 11-6 ikke være oppfylt i samme periode'
            }
            foersteNyePeriodeFraDato={undefined}
          ></IkkeVurderbarPeriode>
        ))}

        {grunnlag.sisteVedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={crypto.randomUUID()}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(!!vurdering.brukerRettPåAAP)}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
          >
            <OvergangUforeTidligereVurdering
              fraDato={vurdering.fom}
              begrunnelse={vurdering.begrunnelse}
              brukerHarSøktOmUføretrygd={vurdering.brukerHarSøktUføretrygd}
              brukerHarFåttVedtakOmUføretrygd={vurdering.brukerHarFåttVedtakOmUføretrygd}
              brukerRettPåAAP={vurdering.brukerRettPåAAP}
            />
          </TidligereVurderingExpandableCard>
        ))}

        {skalStegVurderes &&
          nyeVurderingFields.map((vurdering, index) => {
            return (
              <NyVurderingExpandableCard
                key={vurdering.id}
                accordionsSignal={accordionsSignal}
                fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
                vurderingStatus={getErOppfyltEllerIkkeStatus(erVurderingOppfylt(form, index))}
                nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
                isLast={index === nyeVurderingFields.length - 1}
                vurdering={vurdering}
                finnesFeil={finnesFeilForVurdering(index, errorList)}
                readonly={formReadOnly}
                onSlettVurdering={() => remove(index)}
                harTidligereVurderinger={tidligereVurderinger.length > 0}
                index={index}
                initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
              >
                <OvergangUforeVurderingFormInput
                  index={index}
                  form={form}
                  readonly={formReadOnly}
                  søknadsdatoUføretrygd={grunnlag.uføreSøknadOpplysninger?.soknadsdato}
                />
              </NyVurderingExpandableCard>
            );
          })}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function getDefaultValuesFromGrunnlag(grunnlag: OvergangUforeGrunnlag): OvergangUforeForm {
    if (trengerVurderingsForslag(grunnlag) /*&& grunnlag.ikkeRelevantePerioder.length === 0*/) {
      return hentPerioderSomTrengerVurdering<OvergangUforeVurderingForm>(grunnlag, emptyOvergangUføreVurdering);
    }

    return {
      vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
        fraDato: formaterDatoForFrontend(vurdering.fom),
        begrunnelse: vurdering?.begrunnelse,
        brukerRettPåAAP: getJaNeiEllerUndefined(vurdering?.brukerRettPåAAP),
        brukerHarSøktUføretrygd: getJaNeiEllerUndefined(vurdering?.brukerHarSøktUføretrygd),
        brukerHarFåttVedtakOmUføretrygd: vurdering?.brukerHarFåttVedtakOmUføretrygd || null,
        vurdertAv: vurdering.vurdertAv,
        kvalitetssikretAv: vurdering.kvalitetssikretAv,
        besluttetAv: vurdering.besluttetAv,
        erNyVurdering: false,
        behøverVurdering: false,
      })),
    };
  }

  function emptyOvergangUføreVurdering(): OvergangUforeVurderingForm {
    return {
      fraDato: '',
      begrunnelse: '',
      brukerHarSøktUføretrygd: undefined,
      brukerHarFåttVedtakOmUføretrygd: null,
      brukerRettPåAAP: undefined,
      erNyVurdering: true,
      behøverVurdering: false,
    };
  }
};

function erVurderingOppfylt(form: UseFormReturn<OvergangUforeForm>, index: number) {
  const brukerRettPåAAP = form.watch(`vurderinger.${index}.brukerRettPåAAP`);
  const harSøktUføretrygd = form.watch(`vurderinger.${index}.brukerHarSøktUføretrygd`);
  const harFåttVedtakUføretrygd = form.watch(`vurderinger.${index}.brukerHarFåttVedtakOmUføretrygd`);

  if (brukerRettPåAAP) {
    return brukerRettPåAAP === JaEllerNei.Ja;
  }

  if (harSøktUføretrygd === JaEllerNei.Nei || harFåttVedtakUføretrygd === 'NEI') {
    return false;
  }

  return undefined;
}

function erBistandsbehoveneAvklart(bistandsvurderinger: BistandVurderingResponse[]) {
  return bistandsvurderinger !== undefined && bistandsvurderinger.length > 0;
}

function erBistandsbehoveneOppfylt(bistandsvurderinger: BistandVurderingResponse[]) {
  return bistandsvurderinger.every(erBistandsbehovetOppfylt);
}

function erBistandsbehovetOppfylt(bistandsvurdering: BistandVurderingResponse) {
  return (
    bistandsvurdering.erBehovForAktivBehandling ||
    bistandsvurdering.erBehovForArbeidsrettetTiltak ||
    (bistandsvurdering.erBehovForAnnenOppfølging !== undefined && bistandsvurdering.erBehovForAnnenOppfølging)
  );
}
