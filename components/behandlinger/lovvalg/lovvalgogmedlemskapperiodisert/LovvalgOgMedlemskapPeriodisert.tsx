'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { MellomlagretVurdering, PeriodisertLovvalgMedlemskapGrunnlag } from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { LovOgMedlemskapVurderingForm } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/types';
import {
  getDefaultValuesFromGrunnlag,
  hentPeriodiserteVerdierFraMellomlagretVurdering,
  mapFormTilDto,
} from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/lovvalg-utils';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { LovvalgOgMedlemskapFormInput } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapFormInput';
import { LovvalgOgMedlemskapTidligereVurdering } from 'components/behandlinger/lovvalg/lovvalgogmedlemskapperiodisert/LovvalgOgMedlemskapTidligereVurdering';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: PeriodisertLovvalgMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype.MANUELL_OVERSTYRING_LOVVALG | Behovstype.AVKLAR_LOVVALG_MEDLEMSKAP;
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

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_LOVVALG',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? hentPeriodiserteVerdierFraMellomlagretVurdering(mellomlagretVurdering, grunnlag)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<LovOgMedlemskapVurderingForm>({
    defaultValues,
    reValidateMode: 'onChange',
  });

  const { fields: vurderingerFields, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  function onAddPeriode() {
    append({
      lovvalg: {
        begrunnelse: '',
        lovvalgsEØSLand: '',
      },
      medlemskap: undefined,
      fraDato: undefined,
      erNyVurdering: true,
    });
  }

  function onSubmit(data: LovOgMedlemskapVurderingForm) {
    const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
      form,
      nyeVurderinger: data.vurderinger,
      grunnlag,
    });
    if (!erPerioderGyldige) {
      return;
    }
    const losning: LøsningerForPerioder = {
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
      closeAllAccordions();
      nullstillMellomlagretVurdering();
    });
  }

  const heading = overstyring ? 'Overstyring av lovvalg og medlemskap' : 'Lovvalg og medlemskap';

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = mapPeriodiserteVurderingerErrorList<LovOgMedlemskapVurderingForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={heading}
      steg={'VURDER_LOVVALG'}
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
          vurderingStatus={getErOppfyltEllerIkkeStatus(
            vurdering.lovvalg.lovvalgsEØSLandEllerLandMedAvtale === 'NOR' &&
              vurdering.medlemskap?.varMedlemIFolketrygd === true
          )}
        >
          <LovvalgOgMedlemskapTidligereVurdering vurdering={vurdering} />
        </TidligereVurderingExpandableCard>
      ))}

      {vurderingerFields.map((vurdering, index) => (
        <NyVurderingExpandableCard
          key={vurdering.id}
          accordionsSignal={accordionsSignal}
          fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
          nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
          isLast={index === vurderingerFields.length - 1}
          vurderingStatus={getErOppfyltEllerIkkeStatus(
            form.watch(`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`)
              ? form.watch(`vurderinger.${index}.medlemskap.varMedlemIFolketrygd`) === JaEllerNei.Ja
              : undefined
          )}
          vurdertAv={vurdering.vurdertAv}
          kvalitetssikretAv={vurdering.kvalitetssikretAv}
          besluttetAv={vurdering.besluttetAv}
          finnesFeil={finnesFeilForVurdering(index, errorList)}
          onSlettVurdering={() => remove(index)}
          harTidligereVurderinger={tidligereVurderinger.length > 0}
          index={index}
          readonly={formReadOnly}
          initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
        >
          <LovvalgOgMedlemskapFormInput form={form} readOnly={formReadOnly} index={index} />
        </NyVurderingExpandableCard>
      ))}
    </VilkårskortPeriodisert>
  );
};
