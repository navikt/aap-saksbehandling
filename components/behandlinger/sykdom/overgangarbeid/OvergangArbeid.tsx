'use client';

import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { LøsPeriodisertBehovPåBehandling, MellomlagretVurdering, OvergangArbeidGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { parseISO } from 'date-fns';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { useFieldArray, useForm } from 'react-hook-form';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { OvergangArbeidForm } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
} from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-utils';
import { OvergangArbeidTidligereVurdering } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeidTidligereVurderinger';
import { OvergangArbeidFormInput } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeidFormInput';

interface Props {
  behandlingVersjon: number;
  grunnlag?: OvergangArbeidGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const OvergangArbeid = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('OVERGANG_ARBEID');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.OVERGANG_ARBEID, initialMellomlagretVurdering);

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'OVERGANG_ARBEID',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as OvergangArbeidForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<OvergangArbeidForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const {
    fields: vurderingerFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'vurderinger',
    rules: {},
  });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: '',
      brukerRettPåAAP: '',
    });
  }

  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  const onSubmit = (data: OvergangArbeidForm) => {
    const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
      form,
      nyeVurderinger: data.vurderinger,
      grunnlag,
    });
    if (!erPerioderGyldige) {
      return;
    }
    const losning: LøsPeriodisertBehovPåBehandling = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsReferanse,
      behov: {
        behovstype: Behovstype.OVERGANG_ARBEID,
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
    });
  };

  const errorList = mapPeriodiserteVurderingerErrorList<OvergangArbeidForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-17 AAP i perioden som arbeidssøker'}
      steg="OVERGANG_ARBEID"
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      vurdertAvAnsatt={grunnlag?.sisteVedtatteVurderinger[0]?.vurdertAv}
      kvalitetssikretAv={grunnlag?.sisteVedtatteVurderinger[0]?.kvalitetssikretAv}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(getDefaultValuesFromGrunnlag(grunnlag));
        });
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
      onLeggTilVurdering={onAddPeriode}
      errorList={errorList}
    >
      <>
        {vedtatteVurderinger?.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={vurdering.fom}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            oppfylt={vurdering.brukerRettPåAAP}
          >
            <OvergangArbeidTidligereVurdering
              fraDato={vurdering.fom}
              tilDato={vurdering.tom}
              begrunnelse={vurdering.begrunnelse}
              oppfyller={vurdering.brukerRettPåAAP}
            />
          </TidligereVurderingExpandableCard>
        ))}

        {vurderingerFields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            oppfylt={
              form.watch(`vurderinger.${index}.brukerRettPåAAP`)
                ? form.watch(`vurderinger.${index}.brukerRettPåAAP`) === JaEllerNei.Ja
                : undefined
            }
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === vurderingerFields.length - 1}
            vurdertAv={vurdering.vurdertAv}
            finnesFeil={false}
          >
            <OvergangArbeidFormInput
              form={form}
              visningModus={visningModus}
              readOnly={formReadOnly}
              index={index}
              harTidligereVurderinger={vedtatteVurderinger.length !== 0}
              onRemove={() => remove(index)}
            />
          </NyVurderingExpandableCard>
        ))}
      </>
    </VilkårskortPeriodisert>
  );
};
