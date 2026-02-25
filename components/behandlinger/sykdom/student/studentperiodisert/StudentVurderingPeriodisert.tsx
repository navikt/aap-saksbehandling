'use client';

import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import {
  AvklarPeriodisertStudentLøsning,
  MellomlagretVurdering,
  StudentGrunnlag,
  StudentVurderingResponse,
  VurdertAvAnsatt,
} from 'lib/types/types';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { formaterDatoForBackend, parseDatoFraDatePicker } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';
import { VStack } from '@navikt/ds-react';
import {
  NyVurderingExpandableCard,
  skalVæreInitiellEkspandert,
} from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { RelevantInformasjonStudent } from 'components/behandlinger/sykdom/student/studentperiodisert/RelevantInformasjonStudent';
import { StudentVurderingFelter } from 'components/behandlinger/sykdom/student/studentperiodisert/StudentVurderingFelter';
import { useAccordionsSignal } from 'hooks/AccordionSignalHook';
import { parse, parseISO } from 'date-fns';
import { parseDatoFraDatePickerOgTrekkFra1Dag } from 'components/behandlinger/oppholdskrav/oppholdskrav-utils';
import { mapPeriodiserteVurderingerErrorList } from 'lib/utils/formerrors';
import { VurderingStatus } from 'components/periodisering/VurderingStatusTag';
import { TidligereVurderingExpandableCard } from 'components/periodisering/tidligerevurderingexpandablecard/TidligereVurderingExpandableCard';
import { VedtattStudentVurderinger } from 'components/behandlinger/sykdom/student/studentperiodisert/VedtattStudentVurderinger';
import { hentPerioderSomTrengerVurdering, trengerVurderingsForslag } from 'lib/utils/periodisering';

interface Props {
  behandlingVersjon: number;
  grunnlag: StudentGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface StudentFormFields {
  vurderinger: StudentVurdering[];
}

export interface StudentVurdering {
  fraDato: string;
  begrunnelse: string;
  harAvbruttStudie?: string;
  godkjentStudieAvLånekassen?: string;
  avbruttPgaSykdomEllerSkade?: string;
  harBehovForBehandling?: string;
  avbruttDato?: string;
  avbruddMerEnn6Måneder?: string;
  erNyVurdering?: boolean;
  vurdertAv?: VurdertAvAnsatt;
  kvalitetssikretAv?: VurdertAvAnsatt;
  besluttetAv?: VurdertAvAnsatt;
}

type DraftFormFields = Partial<StudentFormFields>;

export const StudentVurderingPeriodisert = ({
  readOnly,
  initialMellomlagretVurdering,
  grunnlag,
  behandlingVersjon,
}: Props) => {
  const behandlingsreferanse = useBehandlingsReferanse();

  const { mellomlagretVurdering, nullstillMellomlagretVurdering, lagreMellomlagring, slettMellomlagring } =
    useMellomlagring(Behovstype.AVKLAR_STUDENT_KODE, initialMellomlagretVurdering);

  const { visningModus, visningActions, formReadOnly, erAktivUtenAvbryt } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_STUDENT',
    mellomlagretVurdering
  );

  const { accordionsSignal, closeAllAccordions } = useAccordionsSignal();

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError, status } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? parseOgMigrerMellomlagring(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag);

  const form = useForm<StudentFormFields>({ defaultValues, shouldUnregister: true });

  const { fields: nyeVurderinger, remove, append } = useFieldArray({ control: form.control, name: 'vurderinger' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const løsning: AvklarPeriodisertStudentLøsning[] = data.vurderinger.map((vurdering, index) => {
        const isLast = index === data.vurderinger.length - 1;
        const tilDato = isLast ? undefined : parseDatoFraDatePickerOgTrekkFra1Dag(data.vurderinger[index + 1].fraDato);

        return {
          fom: formaterDatoForBackend(parse(vurdering.fraDato, 'dd.MM.yyyy', new Date())),
          tom: tilDato ? formaterDatoForBackend(tilDato) : undefined,
          begrunnelse: vurdering.begrunnelse,
          harAvbruttStudie: vurdering.harAvbruttStudie === JaEllerNei.Ja,
          avbruttStudieDato:
            vurdering.avbruttDato && formaterDatoForBackend(parse(vurdering.avbruttDato, 'dd.MM.yyyy', new Date())),
          harBehovForBehandling: vurdering.harBehovForBehandling
            ? vurdering.harBehovForBehandling === JaEllerNei.Ja
            : undefined,
          avbruddMerEnn6Måneder: vurdering.avbruddMerEnn6Måneder
            ? vurdering.avbruddMerEnn6Måneder === JaEllerNei.Ja
            : undefined,
          avbruttPgaSykdomEllerSkade: vurdering.avbruttPgaSykdomEllerSkade
            ? vurdering.avbruttPgaSykdomEllerSkade === JaEllerNei.Ja
            : undefined,
          godkjentStudieAvLånekassen: vurdering.godkjentStudieAvLånekassen
            ? vurdering.godkjentStudieAvLånekassen === JaEllerNei.Ja
            : undefined,
        };
      });

      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_STUDENT_KODE,
            løsningerForPerioder: løsning,
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

  const errorList = mapPeriodiserteVurderingerErrorList<StudentFormFields>(form.formState.errors);
  const sistevedtatteVurderinger = grunnlag.sisteVedtatteVurderinger;
  const finnesSisteVedtatteVurderinger = sistevedtatteVurderinger && sistevedtatteVurderinger?.length > 0;

  const foersteNyePeriode = nyeVurderinger.length > 0 ? form.watch('vurderinger.0.fraDato') : null;

  return (
    <VilkårskortPeriodisert
      onDeleteMellomlagringClick={() => slettMellomlagring(() => form.reset(mapVurderingToDraftFormFields(grunnlag)))}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={() => append(emptyStudentVurdering())}
      errorList={errorList}
      heading={'§ 11-14 Student'}
      steg={'AVKLAR_STUDENT'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      formReset={() => form.reset()}
    >
      <VStack gap={'4'}>
        <RelevantInformasjonStudent opplysninger={grunnlag.oppgittStudent} />

        {sistevedtatteVurderinger?.map((vurdering, index) => {
          return (
            <TidligereVurderingExpandableCard
              key={index}
              fom={new Dato(vurdering.fom).dato}
              tom={vurdering.tom ? parseISO(vurdering.tom) : undefined}
              foersteNyePeriodeFraDato={foersteNyePeriode != null ? parseDatoFraDatePicker(foersteNyePeriode) : null}
              vurderingStatus={hentVurderingStatusForVedtattVurdering(vurdering)}
              vurdertAv={vurdering.vurdertAv}
            >
              <VedtattStudentVurderinger vurdering={vurdering} />
            </TidligereVurderingExpandableCard>
          );
        })}

        <FormProvider {...form}>
          {nyeVurderinger.map((vurdering, index) => {
            const vurderingValues = form.watch(`vurderinger.${index}`);
            const nesteVurderingValues = form.watch(`vurderinger.${index + 1}`);

            return (
              <NyVurderingExpandableCard
                key={vurdering.id}
                fraDato={gyldigDatoEllerNull(vurderingValues?.fraDato)}
                nestePeriodeFraDato={gyldigDatoEllerNull(nesteVurderingValues?.fraDato)}
                isLast={index === nyeVurderinger.length - 1}
                vurdertAv={vurdering.vurdertAv}
                finnesFeil={errorList.length > 0}
                readonly={formReadOnly}
                onSlettVurdering={() => remove(index)}
                index={index}
                harTidligereVurderinger={finnesSisteVedtatteVurderinger}
                accordionsSignal={accordionsSignal}
                initiellEkspandert={skalVæreInitiellEkspandert(vurdering.erNyVurdering, erAktivUtenAvbryt)}
                vurderingStatus={hentVurderingStatus(vurderingValues)}
                kvalitetssikretAv={vurdering.kvalitetssikretAv}
                besluttetAv={vurdering.besluttetAv}
              >
                <StudentVurderingFelter index={index} readOnly={readOnly} />
              </NyVurderingExpandableCard>
            );
          })}
        </FormProvider>
      </VStack>
    </VilkårskortPeriodisert>
  );
};

function mapVurderingToDraftFormFields(grunnlag: StudentGrunnlag): DraftFormFields {
  if (trengerVurderingsForslag(grunnlag)) {
    return hentPerioderSomTrengerVurdering(grunnlag, () => emptyStudentVurdering());
  }

  return {
    vurderinger: grunnlag.nyeVurderinger?.map((vurdering) => {
      return {
        fraDato: vurdering?.fom ? new Dato(vurdering.fom).formaterForFrontend() : '',
        begrunnelse: vurdering?.begrunnelse || '',
        harAvbruttStudie: getJaNeiEllerUndefined(vurdering?.harAvbruttStudie),
        godkjentStudieAvLånekassen: getJaNeiEllerUndefined(vurdering?.godkjentStudieAvLånekassen),
        avbruttPgaSykdomEllerSkade: getJaNeiEllerUndefined(vurdering?.avbruttPgaSykdomEllerSkade),
        harBehovForBehandling: getJaNeiEllerUndefined(vurdering?.harBehovForBehandling),
        avbruddMerEnn6Måneder: getJaNeiEllerUndefined(vurdering?.avbruddMerEnn6Måneder),
        avbruttDato: vurdering?.avbruttStudieDato
          ? new Dato(vurdering.avbruttStudieDato).formaterForFrontend()
          : undefined,
        vurdertAv: vurdering?.vurdertAv,
        kvalitetssikretAv: vurdering?.kvalitetssikretAv,
        besluttetAv: vurdering?.besluttetAv,
      };
    }),
  };
}

function emptyStudentVurdering(): StudentVurdering {
  return {
    fraDato: '',
    begrunnelse: '',
    avbruddMerEnn6Måneder: '',
    avbruttDato: '',
    avbruttPgaSykdomEllerSkade: '',
    godkjentStudieAvLånekassen: '',
    harAvbruttStudie: '',
    harBehovForBehandling: '',
    erNyVurdering: true,
  };
}

function hentVurderingStatus(
  values?: StudentVurdering
): VurderingStatus.Oppfylt | VurderingStatus.IkkeOppfylt | undefined {
  if (!values) return undefined;

  return utledStatus(
    [
      values.harAvbruttStudie,
      values.godkjentStudieAvLånekassen,
      values.avbruttPgaSykdomEllerSkade,
      values.harBehovForBehandling,
      values.avbruddMerEnn6Måneder,
    ],
    JaEllerNei.Ja,
    JaEllerNei.Nei
  );
}

function hentVurderingStatusForVedtattVurdering(
  values: StudentVurderingResponse
): VurderingStatus.Oppfylt | VurderingStatus.IkkeOppfylt | undefined {
  if (!values) {
    return undefined;
  }

  return utledStatus(
    [
      values.harAvbruttStudie,
      values.godkjentStudieAvLånekassen,
      values.avbruttPgaSykdomEllerSkade,
      values.harBehovForBehandling,
      values.avbruddMerEnn6Måneder,
    ],
    true,
    false
  );
}

function utledStatus<T extends string | boolean>(
  felt: (T | undefined | null)[],
  oppfyltVerdi: T,
  ikkeOppfyltVerdi: T
): VurderingStatus.Oppfylt | VurderingStatus.IkkeOppfylt | undefined {
  for (const feltVerdi of felt) {
    if (feltVerdi === ikkeOppfyltVerdi) {
      return VurderingStatus.IkkeOppfylt;
    }

    if (feltVerdi !== oppfyltVerdi) {
      return undefined;
    }
  }

  return VurderingStatus.Oppfylt;
}

function parseOgMigrerMellomlagring(mellomlagring: string): DraftFormFields {
  const parsedData = JSON.parse(mellomlagring);
  if (erPeriodisertVersjon(parsedData)) {
    return parsedData;
  } else {
    return {
      vurderinger: [
        {
          ...parsedData,
        },
      ],
    };
  }
}

function erPeriodisertVersjon(object: any): object is StudentFormFields {
  return object instanceof Object && object['vurderinger'] != null;
}
