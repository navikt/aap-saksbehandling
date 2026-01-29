'use client';

import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { MellomlagretVurdering, SykepengeerstatningGrunnlag } from 'lib/types/types';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { parseISO } from 'date-fns';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { useFieldArray, useForm } from 'react-hook-form';
import { SykepengeerstatningForm } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstating-types';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
} from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstatning-utils';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { SykepengeerstatningFormInput } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningFormInput';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { OppholdskravSykepengererstatninbgTidligereVurdering } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengererstatningTidligereVurdering';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';

interface Props {
  behandlingVersjon: number;
  grunnlag: SykepengeerstatningGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const Sykepengeerstatning = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, isLoading, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_SYKEPENGEERSTATNING');

  const { lagreMellomlagring, slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } =
    useMellomlagring(Behovstype.VURDER_SYKEPENGEERSTATNING_KODE, initialMellomlagretVurdering);

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, visningModus, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_SYKEPENGEERSTATNING',
    mellomlagretVurdering
  );

  const defaultValues =
    mellomlagretVurdering != null
      ? (JSON.parse(mellomlagretVurdering.data) as SykepengeerstatningForm)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<SykepengeerstatningForm>({
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
      grunn: null,
      erOppfylt: '',
      erNyVurdering: true,
    });
  }

  const foersteNyePeriode = vurderingerFields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  const onSubmit = (data: SykepengeerstatningForm) => {
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
        behovstype: Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
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
    });
  };
  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const errorList = mapPeriodiserteVurderingerErrorList<SykepengeerstatningForm>(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-13 AAP som sykepengeerstatning'}
      steg="VURDER_SYKEPENGEERSTATNING"
      onSubmit={form.handleSubmit(onSubmit)}
      status={status}
      isLoading={isLoading}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      onDeleteMellomlagringClick={() => {
        slettMellomlagring(() => {
          form.reset(getDefaultValuesFromGrunnlag(grunnlag));
        });
      }}
      visningModus={visningModus}
      visningActions={visningActions}
      formReset={() => form.reset(getDefaultValuesFromGrunnlag(grunnlag))}
      onLeggTilVurdering={onAddPeriode}
      errorList={errorList}
    >
      {vedtatteVurderinger?.map((vurdering) => (
        <TidligereVurderingExpandableCard
          key={vurdering.fom}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          vurderingStatus={getErOppfyltEllerIkkeStatus(vurdering.harRettPå)}
        >
          <OppholdskravSykepengererstatninbgTidligereVurdering
            fraDato={vurdering.fom}
            begrunnelse={vurdering.begrunnelse}
            oppfyller={vurdering.harRettPå}
            grunn={vurdering.grunn}
          />
        </TidligereVurderingExpandableCard>
      ))}

      {vurderingerFields.map((vurdering, index) => {
        const erOppfyltFelt = form.watch(`vurderinger.${index}.erOppfylt`);

        return (
          <NyVurderingExpandableCard
            key={vurdering.id}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            vurderingStatus={erOppfyltFelt ? getErOppfyltEllerIkkeStatus(erOppfyltFelt === JaEllerNei.Ja) : undefined}
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === vurderingerFields.length - 1}
            accordionsSignal={accordionsSignal}
            vurdertAv={vurdering.vurdertAv}
            kvalitetssikretAv={vurdering.kvalitetssikretAv}
            besluttetAv={vurdering.besluttetAv}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            readonly={formReadOnly}
            onSlettVurdering={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
            initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
          >
            <SykepengeerstatningFormInput form={form} readOnly={formReadOnly} index={index} />
          </NyVurderingExpandableCard>
        );
      })}
    </VilkårskortPeriodisert>
  );
};
