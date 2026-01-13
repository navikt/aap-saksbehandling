'use client';

import { BistandsGrunnlag, MellomlagretVurdering } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { FormEvent } from 'react';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { BistandsbehovVurderingForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovVurderingForm';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { parseISO } from 'date-fns';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { BistandsbehovTidligereVurdering } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovTidligereVurdering';
import { mapBistandVurderingFormTilDto } from 'components/behandlinger/sykdom/bistandsbehov/bistandsbehov-utils';
import { Dato } from 'lib/types/Dato';
import { parseOgMigrerMellomlagretData } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovMellomlagringParser';
import { getFraDatoFraGrunnlagForFrontend } from 'lib/utils/periodisering';
import { vurdertAvFraPeriodisertVurdering } from 'lib/utils/vurdert-av';
import { Link, VStack } from '@navikt/ds-react';
import { Veiledning } from 'components/veiledning/Veiledning';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: BistandsGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}
export interface BistandForm {
  vurderinger: Array<BistandVurderingForm>;
}
export interface BistandVurderingForm {
  fraDato: string;
  begrunnelse: string;
  erBehovForAktivBehandling: JaEllerNei | undefined;
  erBehovForArbeidsrettetTiltak: JaEllerNei | undefined;
  erBehovForAnnenOppfølging?: JaEllerNei | undefined;
  overgangBegrunnelse?: string;
  skalVurdereAapIOvergangTilArbeid?: JaEllerNei | undefined;
  vurdertAv?: {
    ansattnavn: string | null | undefined;
    ident: string;
    dato: string;
  };
}

export const BistandsbehovPeriodisert = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_BISTANDSBEHOV_KODE, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_BISTANDSBEHOV',
    mellomlagretVurdering
  );

  const defaultValues: BistandForm = initialMellomlagretVurdering
    ? parseOgMigrerMellomlagretData(initialMellomlagretVurdering.data, grunnlag?.behøverVurderinger?.[0]?.fom)
    : mapVurderingerToBistandForm(grunnlag);

  const form = useForm<BistandForm>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
            løsningerForPerioder: data.vurderinger.map((vurdering, index) => {
              const isLast = index === data.vurderinger.length - 1;
              const tilDato = isLast ? undefined : data.vurderinger[index + 1].fraDato;
              return mapBistandVurderingFormTilDto(vurdering, tilDato);
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

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<LovOgMedlemskapVurderingForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      kvalitetssikretAv={grunnlag?.nyeVurderinger[0]?.kvalitetssikretAv}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(
            grunnlag?.nyeVurderinger[0]
              ? mapVurderingerToBistandForm(grunnlag)
              : { vurderinger: [emptyBistandVurderingForm()] }
          );
        });
      }}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      onLeggTilVurdering={() => append(emptyBistandVurderingForm())}
      errorList={errorList}
    >
      <VStack gap={'4'}>
        <Veiledning
          defaultOpen={false}
          tekst={
            <div>
              Vilkårene i § 11-6 første ledd bokstav a til c er tre alternative vilkår. Det vil si at det er nok at
              brukeren oppfyller ett av dem for å fylle vilkåret i § 11-6.Først skal du vurdere om vilkårene i bokstav a
              (aktiv behandling) og bokstav b (arbeidsrettet tiltak) er oppfylte. Hvis du svarer ja på ett eller begge
              vilkårene, er § 11-6 oppfylt. Hvis du svarer nei på a og b, må du vurdere om bokstav c er oppfylt. Hvis du
              svarer nei på alle tre vilkårene, er § 11-6 ikke oppfylt.{' '}
              <Link href="https://lovdata.no/nav/rundskriv/r11-00#KAPITTEL_8" target="_blank">
                Du kan lese om hvordan vilkåret skal vurderes i rundskrivet til § 11-6 (lovdata.no)
              </Link>
            </div>
          }
        />

        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={vurdering.fom}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            oppfylt={
              !!(
                vurdering.erBehovForAktivBehandling ||
                vurdering.erBehovForArbeidsrettetTiltak ||
                vurdering.erBehovForAnnenOppfølging
              )
            }
          >
            <BistandsbehovTidligereVurdering vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}
        {fields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === fields.length - 1}
            oppfylt={
              form.watch(`vurderinger.${index}.erBehovForAktivBehandling`) &&
              form.watch(`vurderinger.${index}.erBehovForArbeidsrettetTiltak`)
                ? form.watch(`vurderinger.${index}.erBehovForAktivBehandling`) === JaEllerNei.Ja ||
                  form.watch(`vurderinger.${index}.erBehovForArbeidsrettetTiltak`) === JaEllerNei.Ja ||
                  form.watch(`vurderinger.${index}.erBehovForAnnenOppfølging`) === JaEllerNei.Ja
                : undefined
            }
            vurdertAv={vurdering.vurdertAv}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            readonly={formReadOnly}
            onRemove={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
          >
            <BistandsbehovVurderingForm form={form} readOnly={formReadOnly} index={index} />
          </NyVurderingExpandableCard>
        ))}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function mapVurderingerToBistandForm(grunnlag?: BistandsGrunnlag): BistandForm {
    if (!grunnlag || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
      // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
      return {
        vurderinger: [
          {
            ...emptyBistandVurderingForm(),
            fraDato: getFraDatoFraGrunnlagForFrontend(grunnlag),
          },
        ],
      };
    }

    // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
    return {
      vurderinger: grunnlag.vurderinger.map((vurdering) => ({
        fraDato: new Dato(vurdering.fom).formaterForFrontend(),
        begrunnelse: vurdering?.begrunnelse,
        erBehovForAktivBehandling: getJaNeiEllerUndefined(vurdering?.erBehovForAktivBehandling),
        erBehovForAnnenOppfølging: getJaNeiEllerUndefined(vurdering?.erBehovForAnnenOppfølging),
        overgangBegrunnelse: vurdering?.overgangBegrunnelse || '',
        skalVurdereAapIOvergangTilArbeid: getJaNeiEllerUndefined(vurdering?.skalVurdereAapIOvergangTilArbeid),
        erBehovForArbeidsrettetTiltak: getJaNeiEllerUndefined(vurdering?.erBehovForArbeidsrettetTiltak),
        vurdertAv: vurdertAvFraPeriodisertVurdering(vurdering.vurdertAv),
      })),
    };
  }

  function emptyBistandVurderingForm(): BistandVurderingForm {
    return {
      fraDato: '',
      begrunnelse: '',
      erBehovForAktivBehandling: undefined,
      erBehovForAnnenOppfølging: undefined,
      overgangBegrunnelse: '',
      skalVurdereAapIOvergangTilArbeid: undefined,
      erBehovForArbeidsrettetTiltak: undefined,
    };
  }
};
