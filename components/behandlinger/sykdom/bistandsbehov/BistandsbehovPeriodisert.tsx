'use client';

import { BistandsbehovVurdering, BistandsGrunnlag, MellomlagretVurdering, TypeBehandling } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { FormEvent } from 'react';
import { formaterDatoForFrontend, parseDatoFraDatePicker } from 'lib/utils/date';
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

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  typeBehandling: TypeBehandling;
  grunnlag?: BistandsGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  overgangArbeidEnabled?: Boolean;
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
}

export const BistandsbehovPeriodisert = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  typeBehandling,
  initialMellomlagretVurdering,
  overgangArbeidEnabled = false,
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
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingerToBistandForm(grunnlag);

  const form = useForm<BistandForm>({ defaultValues, shouldUnregister: true });
  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      // løsPeriodisertBehovOgGåTilNesteSteg(
      //   {
      //     behandlingVersjon: behandlingVersjon,
      //     behov: {
      //       behovstype: Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
      //       bistandsVurdering: {
      //         fom: vurderingenGjelderFra,
      //         begrunnelse: data.begrunnelse,
      //         erBehovForAktivBehandling: data.erBehovForAktivBehandling === JaEllerNei.Ja,
      //         erBehovForArbeidsrettetTiltak: data.erBehovForArbeidsrettetTiltak === JaEllerNei.Ja,
      //         erBehovForAnnenOppfølging: data.erBehovForAnnenOppfølging
      //           ? data.erBehovForAnnenOppfølging === JaEllerNei.Ja
      //           : undefined,
      //         ...(bistandsbehovErIkkeOppfylt && {
      //           skalVurdereAapIOvergangTilArbeid: data.skalVurdereAapIOvergangTilArbeid === JaEllerNei.Ja,
      //           overgangBegrunnelse: data.overgangBegrunnelse,
      //         }),
      //       },
      //     },
      //     referanse: behandlingsReferanse,
      //   },
      //   () => {
      //     nullstillMellomlagretVurdering();
      //     visningActions.onBekreftClick();
      //   }
      // );
    })(event);
  };

  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<LovOgMedlemskapVurderingForm>(form.formState.errors);
  console.log(grunnlag);
  return (
    <VilkårskortPeriodisert
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
      vurdertAvAnsatt={grunnlag?.vurderinger[0]?.vurdertAv}
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
          vurdertAv={undefined} //TODO
          finnesFeil={finnesFeilForVurdering(index, errorList)}
        >
          <BistandsbehovVurderingForm
            form={form}
            readOnly={formReadOnly}
            index={index}
            harTidligereVurderinger={false}
            onRemove={() => remove(index)}
            typeBehandling={typeBehandling}
            overgangArbeidEnabled={overgangArbeidEnabled}
          />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );

  function mapVurderingerToBistandForm(grunnlag?: BistandsGrunnlag): BistandForm {
    if (!grunnlag || (grunnlag.nyeVurderinger.length === 0 && grunnlag.sisteVedtatteVurderinger.length === 0)) {
      // Vi har ingen tidligere vurderinger eller nye vurderinger, legg til en tom-default-periode
      return {
        vurderinger: [
          {
            ...emptyBistandVurderingForm(),
            fraDato: formaterDatoForFrontend(new Date(grunnlag?.kanVurderes[0]?.fom!)),
          },
        ],
      };
    }

    // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
    return {
      vurderinger: grunnlag.vurderinger.map((vurdering) => ({
        fraDato: '',
        begrunnelse: vurdering?.begrunnelse,
        erBehovForAktivBehandling: getJaNeiEllerUndefined(vurdering?.erBehovForAktivBehandling),
        erBehovForAnnenOppfølging: getJaNeiEllerUndefined(vurdering?.erBehovForAnnenOppfølging),
        overgangBegrunnelse: vurdering?.overgangBegrunnelse || '',
        skalVurdereAapIOvergangTilArbeid: getJaNeiEllerUndefined(vurdering?.skalVurdereAapIOvergangTilArbeid),
        erBehovForArbeidsrettetTiltak: getJaNeiEllerUndefined(vurdering?.erBehovForArbeidsrettetTiltak),
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

  function harVurdertOvergangArbeid(vurdering: BistandsbehovVurdering) {
    return vurdering.skalVurdereAapIOvergangTilArbeid === false || vurdering.skalVurdereAapIOvergangTilArbeid === true;
  }
};
