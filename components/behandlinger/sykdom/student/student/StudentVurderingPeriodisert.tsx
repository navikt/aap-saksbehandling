'use client';

import { useConfigForm } from 'components/form/FormHook';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MellomlagretVurdering, StudentGrunnlag } from 'lib/types/types';
import { VilkårskortPeriodisert } from 'components/vilkårskort/vilkårskortperiodisert/VilkårskortPeriodisert';
import { useVilkårskortVisning } from 'hooks/saksbehandling/visning/VisningHook';
import { useMellomlagring } from 'hooks/saksbehandling/MellomlagringHook';
import { Behovstype, getJaNeiEllerUndefined } from 'lib/utils/form';
import { useLøsBehovOgGåTilNesteSteg } from 'hooks/saksbehandling/LøsBehovOgGåTilNesteStegHook';
import { StudentVurderingFelter } from 'components/behandlinger/sykdom/student/student/StudentVurderingFelter';
import { formaterDatoForFrontend } from 'lib/utils/date';
import { Dato } from 'lib/types/Dato';

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

  const { fields } = useFieldArray({ control: form.control, name: 'vurderinger' });

  return (
    <VilkårskortPeriodisert
      onDeleteMellomlagringClick={() => slettMellomlagring()}
      onLagreMellomLagringClick={() => lagreMellomlagring(form.watch())}
      mellomlagretVurdering={mellomlagretVurdering}
      visningModus={visningModus}
      visningActions={visningActions}
      onLeggTilVurdering={() => console.log('Denne mangler')}
      errorList={[]} // TODO Denne mangler
      heading={'§ 11-14 Student'}
      steg={'AVKLAR_STUDENT'}
      onSubmit={() => console.log('Denne mangler')}
      isLoading={isLoading}
      status={status}
      løsBehovOgGåTilNesteStegError={løsBehovOgGåTilNesteStegError}
      vilkårTilhørerNavKontor={false}
      formReset={() => console.log('Denne mangler')}
    >
      <FormProvider {...form}>
        {fields.map((field, index) => {
          return <StudentVurderingFelter key={field.id} index={index} />;
        })}
      </FormProvider>
    </VilkårskortPeriodisert>
  );
};

function mapVurderingToDraftFormFields(vurdering: StudentGrunnlag['studentvurdering']): DraftFormFields {
  return {
    vurderinger: [
      {
        gjelderFra: '',
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
