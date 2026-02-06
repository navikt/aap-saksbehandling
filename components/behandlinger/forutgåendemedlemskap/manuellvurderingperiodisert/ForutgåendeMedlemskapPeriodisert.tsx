'use client';

import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { Behovstype } from 'lib/utils/form';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import {
  BeregningTidspunktGrunnlag,
  MellomlagretVurdering,
  PeriodisertForutgåendeMedlemskapGrunnlag,
} from 'lib/types/types';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { parseISO } from 'date-fns';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { finnesFeilForVurdering, mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { ForutgåendeMedlemskapVurderingForm } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/types';
import {
  erNyVurderingOppfylt,
  getDefaultValuesFromGrunnlag,
  hentPeriodiserteVerdierFraMellomlagretVurdering,
  mapFormTilDto,
} from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/forutgåendemedlemskap-utils';
import { ForutgåendeMedlemskapTidligereVurdering } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapTidligereVurdering';
import { ForutgåendeMedlemskapFormInput } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapFormInput';
import { LøsningerForPerioder } from 'lib/types/løsningerforperioder';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { VurderingerListe } from 'components/periodisering/VurderingerListe';
import { useSak } from 'hooks/SakHook';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: PeriodisertForutgåendeMedlemskapGrunnlag;
  overstyring: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  behovstype: Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP | Behovstype.MANUELL_OVERSTYRING_MEDLEMSKAP;
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
  const { sak } = useSak();
  const behandlingsReferanse = useBehandlingsReferanse();
  const { løsPeriodisertBehovOgGåTilNesteSteg, status, løsBehovOgGåTilNesteStegError, isLoading } =
    useLøsBehovOgGåTilNesteSteg('VURDER_MEDLEMSKAP');

  const { lagreMellomlagring, slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } =
    useMellomlagring(Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP, initialMellomlagretVurdering);

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_MEDLEMSKAP',
    mellomlagretVurdering
  );

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const defaultValues =
    mellomlagretVurdering != null
      ? hentPeriodiserteVerdierFraMellomlagretVurdering(mellomlagretVurdering, grunnlag)
      : getDefaultValuesFromGrunnlag(grunnlag);

  const form = useForm<ForutgåendeMedlemskapVurderingForm>({
    defaultValues,
    reValidateMode: 'onChange',
    shouldUnregister: true,
  });

  const { fields: vurderingerFields, append, remove } = useFieldArray({ control: form.control, name: 'vurderinger' });

  function onAddPeriode() {
    append({
      begrunnelse: '',
      fraDato: undefined,
      erNyVurdering: true,
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
      visningActions.onBekreftClick();
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
      <VurderingerListe
        startDato={parseISO(sak.periode.fom)}
        ikkeRelevantePerioder={grunnlag.ikkeRelevantePerioder}
        vedtatteVurderinger={vedtatteVurderinger}
        nyeVurderinger={vurderingerFields}
        renderVedtattVurdering={(vurdering) => {
          return (
            <TidligereVurderingExpandableCard
              key={vurdering.fom}
              fom={parseISO(vurdering.fom)}
              tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
              foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
              vurderingStatus={getErOppfyltEllerIkkeStatus(
                vurdering.harForutgåendeMedlemskap ||
                  vurdering.varMedlemMedNedsattArbeidsevne === true ||
                  vurdering.medlemMedUnntakAvMaksFemAar === true
              )}
            >
              <ForutgåendeMedlemskapTidligereVurdering vurdering={vurdering} />
            </TidligereVurderingExpandableCard>
          );
        }}
        renderNyVurdering={(vurdering, index) => {
          return (
            <NyVurderingExpandableCard
              key={vurdering.id}
              accordionsSignal={accordionsSignal}
              fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
              nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
              isLast={index === vurderingerFields.length - 1}
              vurderingStatus={getErOppfyltEllerIkkeStatus(
                erNyVurderingOppfylt(
                  form.watch(`vurderinger.${index}.harForutgåendeMedlemskap`),
                  form.watch(`vurderinger.${index}.unntaksvilkår`)
                )
              )}
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
              <ForutgåendeMedlemskapFormInput
                form={form}
                beregningstidspunktGrunnlag={beregningstidspunktGrunnlag}
                readOnly={formReadOnly}
                index={index}
                harTidligereVurderinger={tidligereVurderinger.length !== 0}
              />
            </NyVurderingExpandableCard>
          );
        }}
      />
    </VilkårskortPeriodisert>
  );
};
