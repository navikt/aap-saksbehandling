'use client';

import { parseISO } from 'date-fns';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { MellomlagretVurdering, SykepengeerstatningGrunnlag } from 'lib/types/types';
import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { Behovstype, JaEllerNei } from 'lib/utils/form';
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { loggUmamiVarighet, useUmamiStartTidspunkt } from 'lib/utils/umami/varighet';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { useFieldArray, useForm } from 'react-hook-form';

import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { SykepengeerstatningFormInput } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengeerstatningFormInput';
import { OppholdskravSykepengererstatninbgTidligereVurdering } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/SykepengererstatningTidligereVurdering';
import { SykepengeerstatningForm } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstating-types';
import {
  getDefaultValuesFromGrunnlag,
  mapFormTilDto,
} from 'components/behandlinger/sykdom/vurdersykepengeerstatning/sykepengererstatning-utils';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useLøsAvklaringsbehov } from 'hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov';

interface Props {
  behandlingVersjon: number;
  grunnlag: SykepengeerstatningGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export const Sykepengeerstatning = ({ behandlingVersjon, grunnlag, readOnly, initialMellomlagretVurdering }: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const {
    løsPeriodisertAvklaringsbehov,
    løsAvklaringsbehovStatus,
    løsAvklaringsbehovIsLoading,
    løsAvklaringsbehovError,
  } = useLøsAvklaringsbehov('VURDER_SYKEPENGEERSTATNING');
  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, visningModus, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_SYKEPENGEERSTATNING',
    initialMellomlagretVurdering
  );
  const umamiStartTidspunkt = useUmamiStartTidspunkt(visningModus);

  const defaultValues = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<SykepengeerstatningForm>({
    defaultValues,
    reValidateMode: 'onChange',
    shouldUnregister: true,
  });

  const { slettMellomlagring, nullstillMellomlagretVurdering, mellomlagretVurdering } = useMellomlagring(
    Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
    initialMellomlagretVurdering,
    form
  );

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
      behøverVurdering: false,
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
      referanse: behandlingsreferanse,
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

    løsPeriodisertAvklaringsbehov(losning, () => {
      loggUmamiVarighet('STEG_SYKEPENGEERSTATNING_VARIGHET', umamiStartTidspunkt, Date.now());
      nullstillMellomlagretVurdering();
      visningActions.onBekreftClick();
      closeAllAccordions();
    });
  };
  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];

  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-13 AAP som sykepengeerstatning'}
      steg="VURDER_SYKEPENGEERSTATNING"
      onSubmit={form.handleSubmit(onSubmit)}
      status={løsAvklaringsbehovStatus}
      isLoading={løsAvklaringsbehovIsLoading}
      løsBehovOgGåTilNesteStegError={løsAvklaringsbehovError}
      vilkårTilhørerNavKontor={false}
      mellomlagretVurdering={mellomlagretVurdering}
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
          key={crypto.randomUUID()}
          fom={parseISO(vurdering.fom)}
          tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
          førsteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
          vurderingStatus={getErOppfyltEllerIkkeStatus(vurdering.harRettPå)}
          vurderingerMeta={vurdering.vurderingerMeta}
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
            vurdering={vurdering}
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
