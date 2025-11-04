'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  LøsPeriodisertBehovPåBehandling,
  MellomlagretVurdering,
  PeriodisertLovvalgMedlemskapGrunnlag,
} from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
} from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/lovvalg-utils';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { LovvalgOgMedlemskapFormInput } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapFormInput';
import { LovvalgOgMedlemskapTidligereVurdering } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapTidligereVurdering';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag?: PeriodisertLovvalgMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype;
}

export const LovvalgOgMedlemskapPeriodisert = ({
  grunnlag,
  readOnly,
  behandlingVersjon,
  overstyring,
  initialMellomlagretVurdering,
  behovstype,
}: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_LOVVALG');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus } = useVilkårskortVisning(
    readOnly,
    'VURDER_LOVVALG',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as LovOgMedlemskapVurderingForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<LovOgMedlemskapVurderingForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const { fields: vurderingerFields, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      lovvalg: {
        begrunnelse: '',
        lovvalgsEØSLand: 'NOR',
      },
      medlemskap: undefined,
      fraDato: undefined,
    });
  }

  function onSubmit(data: LovOgMedlemskapVurderingForm) {
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

  const heading = overstyring ? 'Overstyring av lovvalg og medlemskap' : 'Lovvalg og medlemskap';

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  return (
    <VilkårskortPeriodisert
      heading={heading}
      steg={'VURDER_LOVVALG'}
      onSubmit={form.handleSubmit(onSubmit)}
      visBekreftKnapp={!readOnly}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring({ ...form.watch(), overstyring })}
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(getDefaultValuesFromGrunnlag(grunnlag)))}
      readOnly={readOnly}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={onAddPeriode}
      errors={form.formState.errors}
      formReset={() => form.reset(mellomlagretVurdering ? JSON.parse(mellomlagretVurdering.data) : undefined)}
    >
      {vedtatteVurderinger.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          oppfylt={
            vurdering.lovvalg.lovvalgsEØSLandEllerLandMedAvtale === 'NOR' &&
            vurdering.medlemskap?.varMedlemIFolketrygd === true
          }
        >
          <LovvalgOgMedlemskapTidligereVurdering vurdering={vurdering} />
        </TidligereVurderingExpandableCard>
      ))}
      {vurderingerFields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          nestePeriodeFraDato={form.watch(`vurderinger.${index + 1}.fraDato`)}
          isLast={index === vurderingerFields.length - 1}
          oppfylt={form.watch(`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`)}
          fraDato={vurdering.fraDato}
          vurdertAv={vurdering.vurdertAv}
        >
          <LovvalgOgMedlemskapFormInput
            form={form}
            readOnly={formReadOnly}
            index={index}
            harTidligereVurderinger={tidligereVurderinger.length !== 0}
            onRemove={() => remove(index)}
            visningModus={visningModus}
          />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};
