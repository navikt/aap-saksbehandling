'use client';

import { BistandsGrunnlag, MellomlagretVurdering, VurderingFormMeta } from 'lib/types/types';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { SubmitEventHandler } from 'react';
import { parseDatoFraDatePicker } from 'lib/utils/date';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { useParamsMedType } from 'hooks/saksbehandling/BehandlingHook';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useFieldArray, useForm } from 'react-hook-form';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { BistandsbehovVurderingForm } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovVurderingForm';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { parseISO } from 'date-fns';
import { finnesFeilForVurdering, hentFeilmeldingerForForm } from 'lib/utils/formerrors';
import { BistandsbehovTidligereVurdering } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovTidligereVurdering';
import {
  erNyVurderingOppfylt,
  mapBistandVurderingFormTilDto,
} from 'components/behandlinger/sykdom/bistandsbehov/bistandsbehov-utils';
import { Dato } from 'lib/types/Dato';
import { parseOgMigrerMellomlagretData } from 'components/behandlinger/sykdom/bistandsbehov/BistandsbehovMellomlagringParser';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';
import { VStack } from '@navikt/ds-react';
import { Veiledning } from 'components/veiledning/Veiledning';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { getErOppfyltEllerIkkeStatus } from 'components/periodisering/VurderingStatusTag';
import { validerPeriodiserteVurderingerRekkefølge } from 'lib/utils/validering';
import { EksterneLenkerIVilkårskort } from 'components/vilkårskort/eksternelenkerivilkårskort/EksterneLenkerIVilkårskort';
import { Alert } from 'components/alert/Alert';

interface Props {
  behandlingVersjon: number;
  readOnly: boolean;
  grunnlag: BistandsGrunnlag;
  initialMellomlagretVurdering?: MellomlagretVurdering;
  erRevurderingAvOvergangUføre: boolean;
}
export interface BistandForm {
  vurderinger: Array<BistandVurderingForm>;
}
export interface BistandVurderingForm extends VurderingFormMeta {
  fraDato: string;
  begrunnelse: string;
  erBehovForAktivBehandling: JaEllerNei | undefined;
  erBehovForArbeidsrettetTiltak: JaEllerNei | undefined;
  erBehovForAnnenOppfølging?: JaEllerNei | undefined;
  overgangBegrunnelse?: string;
  skalVurdereAapIOvergangTilArbeid?: JaEllerNei | undefined;
}

export const Bistandsbehov = ({
  behandlingVersjon,
  grunnlag,
  readOnly,
  initialMellomlagretVurdering,
  erRevurderingAvOvergangUføre,
}: Props) => {
  const { behandlingsreferanse } = useParamsMedType();
  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, status, løsBehovOgGåTilNesteStegError } =
    useLøsBehovOgGåTilNesteSteg('VURDER_BISTANDSBEHOV');

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { visningActions, formReadOnly, visningModus, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'VURDER_BISTANDSBEHOV',
    initialMellomlagretVurdering
  );

  const defaultValues: BistandForm = initialMellomlagretVurdering
    ? parseOgMigrerMellomlagretData(initialMellomlagretVurdering.data, grunnlag?.behøverVurderinger?.[0]?.fom)
    : mapVurderingerToBistandForm(grunnlag);

  const form = useForm<BistandForm>({ defaultValues, shouldUnregister: true });
  const { fields, append, remove } = useFieldArray({ name: 'vurderinger', control: form.control });

  const { slettMellomlagring, mellomlagretVurdering, nullstillMellomlagretVurdering } = useMellomlagring(
    Behovstype.AVKLAR_BISTANDSBEHOV_KODE,
    initialMellomlagretVurdering,
    form
  );

  const handleSubmit: SubmitEventHandler = (event) => {
    form.handleSubmit((data) => {
      const erPerioderGyldige = validerPeriodiserteVurderingerRekkefølge({
        form,
        nyeVurderinger: data.vurderinger,
        grunnlag,
        vurderingerKanIkkeVæreFørKanVurderes: true,
      });
      if (!erPerioderGyldige) {
        return;
      }
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
          referanse: behandlingsreferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
          closeAllAccordions();
        }
      );
    })(event);
  };

  const tidligereVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const vedtatteVurderinger = grunnlag?.sisteVedtatteVurderinger ?? [];
  const foersteNyePeriode = fields.length > 0 ? form.watch('vurderinger.0.fraDato') : null;
  const errorList = hentFeilmeldingerForForm(form.formState.errors);

  return (
    <VilkårskortPeriodisert
      heading={'§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid'}
      steg={'VURDER_BISTANDSBEHOV'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={true}
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
      formReset={() => form.reset(mapVurderingerToBistandForm(grunnlag))}
      onLeggTilVurdering={() => append(emptyBistandVurderingForm())}
      errorList={errorList}
    >
      <VStack gap={'space-16'}>
        <Veiledning defaultOpen={false} tekst={<EksterneLenkerIVilkårskort steg={'VURDER_BISTANDSBEHOV'} />} />

        {erRevurderingAvOvergangUføre && (
          <Alert variant={'info'}>
            Hvis brukeren skal vurderes for uføretrygd og ha AAP etter § 11-18, må du først vurdere at brukeren ikke
            lenger har behov for bistand etter § 11-6.
          </Alert>
        )}

        {vedtatteVurderinger.map((vurdering) => (
          <TidligereVurderingExpandableCard
            key={crypto.randomUUID()}
            fom={parseISO(vurdering.fom)}
            tom={vurdering.tom != null ? parseISO(vurdering.tom) : null}
            førsteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
            vurderingStatus={getErOppfyltEllerIkkeStatus(
              !!(
                vurdering.erBehovForAktivBehandling ||
                vurdering.erBehovForArbeidsrettetTiltak ||
                vurdering.erBehovForAnnenOppfølging
              )
            )}
            vurderingerMeta={vurdering.vurderingerMeta}
          >
            <BistandsbehovTidligereVurdering vurdering={vurdering} />
          </TidligereVurderingExpandableCard>
        ))}

        {fields.map((vurdering, index) => (
          <NyVurderingExpandableCard
            key={vurdering.id}
            accordionsSignal={accordionsSignal}
            fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.fraDato`))}
            nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.fraDato`))}
            isLast={index === fields.length - 1}
            vurderingStatus={getErOppfyltEllerIkkeStatus(erNyVurderingOppfylt(form.watch(`vurderinger.${index}`)))}
            vurdering={vurdering}
            readonly={formReadOnly}
            onSlettVurdering={() => remove(index)}
            harTidligereVurderinger={tidligereVurderinger.length > 0}
            index={index}
            finnesFeil={finnesFeilForVurdering(index, errorList)}
            initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
          >
            <BistandsbehovVurderingForm form={form} readOnly={formReadOnly} index={index} />
          </NyVurderingExpandableCard>
        ))}
      </VStack>
    </VilkårskortPeriodisert>
  );

  function mapVurderingerToBistandForm(grunnlag: BistandsGrunnlag): BistandForm {
    if (trengerVurderingsForslag(grunnlag)) {
      return hentPerioderSomTrengerVurdering<BistandVurderingForm>(grunnlag, emptyBistandVurderingForm);
    }

    // Vi har allerede data lagret, vis enten de som er lagret i grunnlaget her eller tom liste
    return {
      vurderinger: grunnlag.nyeVurderinger.map((vurdering) => ({
        fraDato: new Dato(vurdering.fom).formaterForFrontend(),
        begrunnelse: vurdering?.begrunnelse,
        erBehovForAktivBehandling: getJaNeiEllerUndefined(vurdering?.erBehovForAktivBehandling),
        erBehovForAnnenOppfølging: getJaNeiEllerUndefined(vurdering?.erBehovForAnnenOppfølging),
        overgangBegrunnelse: vurdering?.overgangBegrunnelse || '',
        skalVurdereAapIOvergangTilArbeid: getJaNeiEllerUndefined(vurdering?.skalVurdereAapIOvergangTilArbeid),
        erBehovForArbeidsrettetTiltak: getJaNeiEllerUndefined(vurdering?.erBehovForArbeidsrettetTiltak),
        vurderingerMeta: vurdering.vurderingerMeta,
        erNyVurdering: false,
        behøverVurdering: false,
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
      erNyVurdering: true,
      behøverVurdering: false,
    };
  }
};
