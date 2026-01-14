'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  BeregningTidspunktGrunnlag,
  LøsPeriodisertBehovPåBehandling,
  MellomlagretVurdering,
  PeriodisertForutgåendeMedlemskapGrunnlag,
} from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { ForutgåendeMedlemskapVurderingForm } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/types';
import {
  getDefaultValuesFromGrunnlag,
  hentPeriodiserteVerdierFraMellomlagretVurdering,
  mapFormTilDto,
} from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/forutgåendemedlemskap-utils';
import { ForutgåendeMedlemskapTidligereVurdering } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapTidligereVurdering';
import { ForutgåendeMedlemskapFormInput } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapFormInput';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: PeriodisertForutgåendeMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype;
  beregningstidspunktGrunnlag?: BeregningTidspunktGrunnlag;
}

export const ForutgåendeMedlemskapPeriodisert = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
  behovstype,
  beregningstidspunktGrunnlag,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_MEDLEMSKAP');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_MEDLEMSKAP',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? hentPeriodiserteVerdierFraMellomlagretVurdering(mellomlagretVurdering, grunnlag)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<ForutgåendeMedlemskapVurderingForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const { fields: vurderingerFields, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: undefined,
    });
  }

  function onSubmit(data: ForutgåendeMedlemskapVurderingForm) {
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
      referanse: behandlingsReferanse,

      behov: {
        behovstype: behovstype,
        løsningerForPerioder: data.vurderinger.map((periode, index) => {
          const isLast = index === data.vurderinger.length - 1;
          const tilDato = isLast ? undefined : data.vurderinger[index + 1].fraDato;
          return mapFormTilDto(periode, tilDato);
        }),
      },
    };

    løsPeriodisertBehovOgGåTilNesteSteg(losning, () => {
      nullstillMellomlagretVurdering();
    });
  }

  const heading = overstyring ? 'Overstyring av § 11-2 Forutgående medlemskap' : '§ 11-2 Forutgående medlemskap';

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<ForutgåendeMedlemskapVurderingForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={heading}
      steg={'VURDER_MEDLEMSKAP'}
      onSubmit={form.handleSubmit(onSubmit)}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring({ ...form.watch(), overstyring })}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={onAddPeriode}
      errorList={errorList}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
    >
      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={
            vurdering.harForutgåendeMedlemskap ||
            vurdering.varMedlemMedNedsattArbeidsevne === true ||
            vurdering.medlemMedUnntakAvMaksFemAar === true
          }
        >
          <ForutgåendeMedlemskapTidligereVurdering vurdering={vurdering} />
        </TidligereVurderingExpandableCard>
      ))}
      {vurderingerFields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vurderingerFields.length - 1}
          oppfylt={
            form.watch(`vurderinger.${index}.harForutgåendeMedlemskap`) === JaEllerNei.Ja ||
            form.watch(`vurderinger.${index}.unntaksvilkår`) === 'A' ||
            form.watch(`vurderinger.${index}.unntaksvilkår`) === 'B'
          }
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          readonly={formReadOnly}
          onRemove={() => remove(index)}
          harTidligereVurderinger={tidligereVurderinger.length > 0}
          index={index}
        >
          <ForutgåendeMedlemskapFormInput
            form={form}
            beregningstidspunktGrunnlag={beregningstidspunktGrunnlag}
            readOnly={formReadOnly}
            index={index}
            harTidligereVurderinger={tidligereVurderinger.length !== 0}
          />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};
