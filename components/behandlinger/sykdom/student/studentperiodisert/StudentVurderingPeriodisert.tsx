'use client';

import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { AvklarPeriodisertStudentLøsning, MellomlagretVurdering, StudentGrunnlag } from 'lib/types/types';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';

import { formaterDatoForFrontend } from 'lib/utils/date';
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

interface Props {
  behandlingVersjon: number;
  grunnlag?: StudentGrunnlag;
  readOnly: boolean;
  initialMellomlagretVurdering?: MellomlagretVurdering;
}

export interface StudentFormFields {
  vurderinger: StudentVurdering[];
}

interface StudentVurdering {
  gjelderFra: string;
  begrunnelse: string;
  harAvbruttStudie?: string;
  godkjentStudieAvLånekassen?: string;
  avbruttPgaSykdomEllerSkade?: string;
  harBehovForBehandling?: string;
  avbruttDato?: string;
  avbruddMerEnn6Måneder?: string;
  erNyVurdering?: boolean;
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
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.studentvurdering);

  const form = useForm<StudentFormFields>({ defaultValues, shouldUnregister: true });

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'vurderinger' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      const løsning: AvklarPeriodisertStudentLøsning[] = data.vurderinger.map((vurdering) => {
        return {
          begrunnelse: vurdering.begrunnelse,
          avbruddMerEnn6Måneder: vurdering.avbruddMerEnn6Måneder === JaEllerNei.Ja,
          harAvbruttStudie: vurdering.harAvbruttStudie === JaEllerNei.Ja,
          avbruttStudieDato: vurdering.avbruttDato,
          avbruttPgaSykdomEllerSkade: vurdering.avbruttPgaSykdomEllerSkade === JaEllerNei.Ja,
          fom: vurdering.gjelderFra,
          godkjentStudieAvLånekassen: vurdering.godkjentStudieAvLånekassen === JaEllerNei.Ja,
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

  return (
    <VilkårskortPeriodisert
      onDeleteMellomlagringClick={() => slettMellomlagring()}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={() => append(emptyStudentVurdering())}
      errorList={[]} // TODO Denne mangler
      heading={'§ 11-14 Student'}
      steg={'AVKLAR_STUDENT'}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      formReset={() => console.log('Denne mangler')}
    >
      <VStack gap={'4'}>
        <RelevantInformasjonStudent opplysninger={grunnlag?.oppgittStudent} />

        <FormProvider {...form}>
          {fields.map((field, index) => {
            return (
              <NyVurderingExpandableCard
                key={field.id}
                fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.gjelderFra`))}
                nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.gjelderFra`))}
                isLast={index === fields.length - 1}
                vurdertAv={grunnlag?.studentvurdering?.vurdertAv}
                finnesFeil={false} // TODO Fiks denne
                readonly={formReadOnly}
                onSlettVurdering={() => remove(index)}
                index={index}
                harTidligereVurderinger={false} // TODO Fiks denne
                accordionsSignal={accordionsSignal}
                initiellEkspandert={skalVæreInitiellEkspandert(field.erNyVurdering, erAktivUtenAvbryt)}
                vurderingStatus={undefined}
                kvalitetssikretAv={undefined}
                besluttetAv={undefined}
              >
                <StudentVurderingFelter index={index} />
              </NyVurderingExpandableCard>
            );
          })}
        </FormProvider>
      </VStack>
    </VilkårskortPeriodisert>
  );
};

function mapVurderingToDraftFormFields(vurdering: StudentGrunnlag['studentvurdering']): DraftFormFields {
  return {
    vurderinger: [
      {
        gjelderFra: new Dato(new Date()).formaterForFrontend(),
        begrunnelse: vurdering?.begrunnelse || '',
        harAvbruttStudie: getJaNeiEllerUndefined(vurdering?.harAvbruttStudie),
        godkjentStudieAvLånekassen: getJaNeiEllerUndefined(vurdering?.godkjentStudieAvLånekassen),
        avbruttPgaSykdomEllerSkade: getJaNeiEllerUndefined(vurdering?.avbruttPgaSykdomEllerSkade),
        harBehovForBehandling: getJaNeiEllerUndefined(vurdering?.harBehovForBehandling),
        avbruddMerEnn6Måneder: getJaNeiEllerUndefined(vurdering?.avbruddMerEnn6Måneder),
        avbruttDato: vurdering?.avbruttStudieDato ? formaterDatoForFrontend(vurdering.avbruttStudieDato) : undefined,
      },
    ],
  };
}

function emptyStudentVurdering() {
  return {
    gjelderFra: new Dato(new Date()).formaterForFrontend(),
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
