'use client';

import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { OppholdskravForm } from 'components/behandlinger/oppholdskrav/types';
import { LøsPeriodisertBehovPåBehandling, MellomlagretVurdering, OppholdskravGrunnlagResponse } from 'lib/types/types';
import { useFieldArray, useForm } from 'react-hook-form';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
  parseDatoFraDatePickerOgTrekkFra1Dag,
} from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { OppholdskravFormInput } from 'components/behandlinger/oppholdskrav/OppholdskravFormInput';
import { OppholdskravTidligereVurdering } from 'components/behandlinger/oppholdskrav/OppholdskravTidligereVurdering';
import { parseISO } from 'date-fns';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';

type Props = {
  grunnlag: OppholdskravGrunnlagResponse | undefined;
  initialMellomlagring?: MellomlagretVurdering;
  behandlingVersjon: number;
  readOnly: boolean;
};

export const OppholdskravSteg = ({ grunnlag, initialMellomlagring, behandlingVersjon, readOnly }: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_OPPHOLDSKRAV');

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.OPPHOLDSKRAV_KODE, initialMellomlagring);

  const { visningActions, visningModus, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'VURDER_OPPHOLDSKRAV',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as OppholdskravForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<OppholdskravForm>({
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
      oppfyller: undefined,
      land: '',
      landAnnet: undefined,
      fraDato: undefined,
    });
  }

  function onSubmit(data: OppholdskravForm) {
    const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
      form,
      nyeVurderinger: data.vurderinger,
      grunnlag,
      tidligsteDatoMåMatcheMedRettighetsperiode: false,
    });
    if (!erPerioderGyldige) {
      return;
    }
    const losning: LøsPeriodisertBehovPåBehandling = {
      behandlingVersjon: behandlingVersjon,
      referanse: behandlingsreferanse,
      behov: {
        behovstype: Behovstype.OPPHOLDSKRAV_KODE,
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
  }

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<LovOgMedlemskapVurderingForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'Oppholdskrav § 11-3'}
      steg={'VURDER_OPPHOLDSKRAV'}
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
      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={vurdering.oppfylt}
        >
          <OppholdskravTidligereVurdering
            fraDato={vurdering.fom}
            begrunnelse={vurdering.begrunnelse}
            land={vurdering.land}
            oppfyller={vurdering.oppfylt}
          />
        </TidligereVurderingExpandableCard>
      ))}
      {vurderingerFields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          oppfylt={
            form.watch(`vurderinger.${index}.oppfyller`)
              ? form.watch(`vurderinger.${index}.oppfyller`) === JaEllerNei.Ja
              : undefined
          }
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vurderingerFields.length - 1}
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          readonly={formReadOnly}
          onSlettVurdering={() => remove(index)}
          harTidligereVurderinger={tidligereVurderinger.length > 0}
          index={index}
        >
          <OppholdskravFormInput form={form} readOnly={formReadOnly} index={index} />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};
