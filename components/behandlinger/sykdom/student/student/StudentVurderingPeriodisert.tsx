'use client';

import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MellomlagretVurdering, StudentGrunnlag } from 'lib/types/types';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, getJaNeiEllerUndefined, JaEllerNei } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { StudentVurderingFelter } from 'components/behandlinger/sykdom/student/student/StudentVurderingFelter';
import { formaterDatoForBackend, formaterDatoForFrontend } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';
import { VStack } from '@navikt/ds-react';
import { NyVurderingExpandableCard } from 'components/periodisering/nyvurderingexpandablecard/NyVurderingExpandableCard';
import { gyldigDatoEllerNull } from 'lib/validation/dateValidation';
import { FormEvent } from 'react';
import { useBehandlingsReferanse } from 'hooks/saksbehandling/BehandlingHook';
import { parse } from 'date-fns';
import { RelevantInformasjonStudent } from 'components/behandlinger/sykdom/student/student/RelevantInformasjonStudent';

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
  begrunnelse?: string;
  harAvbruttStudie?: string;
  godkjentStudieAvLånekassen?: string;
  avbruttPgaSykdomEllerSkade?: string;
  harBehovForBehandling?: string;
  avbruttDato?: string;
  avbruddMerEnn6Måneder?: string;
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

  const { visningModus, visningActions, formReadOnly } = useVilkårskortVisning(
    readOnly,
    'AVKLAR_STUDENT',
    mellomlagretVurdering
  );

  const { løsPeriodisertBehovOgGåTilNesteSteg, isLoading, løsBehovOgGåTilNesteStegError, status } =
    useLøsBehovOgGåTilNesteSteg('AVKLAR_STUDENT');

  const defaultValues: DraftFormFields = initialMellomlagretVurdering
    ? JSON.parse(initialMellomlagretVurdering.data)
    : mapVurderingToDraftFormFields(grunnlag?.studentvurdering);

  const form = useForm<StudentFormFields>({ defaultValues });

  const { fields, remove, append } = useFieldArray({ control: form.control, name: 'vurderinger' });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    form.handleSubmit((data) => {
      løsPeriodisertBehovOgGåTilNesteSteg(
        {
          behandlingVersjon: behandlingVersjon,
          behov: {
            behovstype: Behovstype.AVKLAR_SYKDOM_KODE,
            // @ts-ignore TODO Studentvurdering er ikke lagt inn i backend enda
            løsningerForPerioder: data.vurderinger.map((data) => {
              return {
                begrunnelse: data.begrunnelse,
                harAvbruttStudie: data.harAvbruttStudie === JaEllerNei.Ja,
                avbruttStudieDato:
                  data.avbruttDato && formaterDatoForBackend(parse(data.avbruttDato, 'dd.MM.yyyy', new Date())),
                harBehovForBehandling: data.harBehovForBehandling
                  ? data.harBehovForBehandling === JaEllerNei.Ja
                  : undefined,
                avbruddMerEnn6Måneder: data.avbruddMerEnn6Måneder
                  ? data.avbruddMerEnn6Måneder === JaEllerNei.Ja
                  : undefined,
                avbruttPgaSykdomEllerSkade: data.avbruttPgaSykdomEllerSkade
                  ? data.avbruttPgaSykdomEllerSkade === JaEllerNei.Ja
                  : undefined,
                godkjentStudieAvLånekassen: data.godkjentStudieAvLånekassen
                  ? data.godkjentStudieAvLånekassen === JaEllerNei.Ja
                  : undefined,
              };
            }),
          },
          referanse: behandlingsreferanse,
        },
        () => {
          nullstillMellomlagretVurdering();
          visningActions.onBekreftClick();
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
      <VStack gap={'4'} paddingBlock={'4'}>
        <RelevantInformasjonStudent opplysninger={grunnlag?.oppgittStudent} />

        <FormProvider {...form}>
          {fields.map((field, index) => {
            return (
              <NyVurderingExpandableCard
                key={field.id}
                fraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index}.gjelderFra`))}
                nestePeriodeFraDato={gyldigDatoEllerNull(form.watch(`vurderinger.${index + 1}.gjelderFra`))}
                isLast={index === fields.length - 1}
                oppfylt={true} // TODO Fiks denne
                vurdertAv={grunnlag?.studentvurdering?.vurdertAv}
                finnesFeil={false} // TODO Fiks denne
                readonly={formReadOnly}
                onRemove={() => remove(index)}
                index={index}
                harTidligereVurderinger={false} // TODO Fiks denne
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
        gjelderFra: new Dato(new Date()).formaterForFrontend(), // TODO Denne må vi hente fra vurderingen
        begrunnelse: vurdering?.begrunnelse,
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

function emptyDraftFormFields(): DraftFormFields {
  return {
    vurderinger: [
      {
        gjelderFra: new Dato(new Date()).formaterForFrontend(),
        begrunnelse: '',
        avbruddMerEnn6Måneder: '',
        avbruttDato: '',
        avbruttPgaSykdomEllerSkade: '',
        godkjentStudieAvLånekassen: '',
        harAvbruttStudie: '',
        harBehovForBehandling: '',
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
  };
}
