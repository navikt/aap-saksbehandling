import { StudentGrunnlag, SykdomsGrunnlag, TypeBehandling } from 'lib/types/types';
import { DiagnoseSystem, diagnoseSøker } from 'lib/diagnosesøker/DiagnoseSøker';
import { uniqBy } from 'lodash';
import { ValuePair } from 'components/form/FormField';

export interface DiagnoserDefaultOptions {
  ICPC2: {
    hoveddiagnoserOptions: ValuePair[];
    bidiagnoserOptions: ValuePair[];
  };
  ICD10: {
    hoveddiagnoserOptions: ValuePair[];
    bidiagnoserOptions: ValuePair[];
  };
}

export async function getDefaultOptionsForDiagnosesystem(defaultValue?: Diagnoser[]): Promise<DiagnoserDefaultOptions> {
  const icpc2HoveddiagnoserOptions: ValuePair[] = [];
  const icpc2BidiagnoserOptions: ValuePair[] = [];

  const icd10HoveddiagnoserOptions: ValuePair[] = [];
  const icd10BidiagnoserOptions: ValuePair[] = [];

  defaultValue?.forEach((value) => {
    if (value.type === 'HOVEDDIAGNOSE') {
      const options = diagnoseSøker(value.kodeverk as DiagnoseSystem, value.diagnose);
      if (value.kodeverk === 'ICPC2') {
        icpc2HoveddiagnoserOptions.push(...options);
      } else {
        icd10HoveddiagnoserOptions.push(...options);
      }
    }

    if (value.type === 'BIDIAGNOSE') {
      value.diagnose.forEach((biDiagnose) => {
        const options = diagnoseSøker(value.kodeverk as DiagnoseSystem, biDiagnose);
        if (value.kodeverk === 'ICPC2') {
          icpc2BidiagnoserOptions.push(...options);
        } else {
          icd10BidiagnoserOptions.push(...options);
        }
      });
    }
  });

  const ekstraOptionsICPC2 = diagnoseSøker('ICPC2', '');
  const ekstraOptionsICD10 = diagnoseSøker('ICD10', '');

  icpc2HoveddiagnoserOptions.push(...ekstraOptionsICPC2);
  icpc2BidiagnoserOptions.push(...ekstraOptionsICPC2);

  icd10HoveddiagnoserOptions.push(...ekstraOptionsICD10);
  icd10BidiagnoserOptions.push(...ekstraOptionsICD10);

  return {
    ICD10: {
      hoveddiagnoserOptions: uniqBy(icd10HoveddiagnoserOptions, 'value'),
      bidiagnoserOptions: uniqBy(icd10BidiagnoserOptions, 'value'),
    },
    ICPC2: {
      hoveddiagnoserOptions: uniqBy(icpc2HoveddiagnoserOptions, 'value'),
      bidiagnoserOptions: uniqBy(icpc2BidiagnoserOptions, 'value'),
    },
  };
}

// Brukes kun til å finne felter for ny vurdering
export function hentSisteLagredeVurdering(typeBehandling: TypeBehandling, grunnlag: SykdomsGrunnlag) {
  if (typeBehandling === 'Revurdering' && !grunnlag.nyeVurderinger.at(-1)?.kodeverk) {
    return grunnlag.sisteVedtatteVurderinger.at(-1);
  }
  return grunnlag.nyeVurderinger.at(-1);
}

export interface HovedDiagnoser {
  type: 'HOVEDDIAGNOSE';
  diagnose: string;
  kodeverk: string;
}

export interface BiDiagnoser {
  type: 'BIDIAGNOSE';
  diagnose: string[];
  kodeverk: string;
}

export type Diagnoser = HovedDiagnoser | BiDiagnoser;

export function finnDiagnoseGrunnlagForSykdom(grunnlag: SykdomsGrunnlag): Diagnoser[] {
  return [...grunnlag.sisteVedtatteVurderinger, ...grunnlag.nyeVurderinger].flatMap((vurdering) => {
    const result: Diagnoser[] = [];

    if (vurdering.hoveddiagnose && vurdering.kodeverk) {
      result.push({
        type: 'HOVEDDIAGNOSE',
        diagnose: vurdering.hoveddiagnose,
        kodeverk: vurdering.kodeverk,
      });
    }

    if (vurdering.bidiagnoser && vurdering.kodeverk) {
      result.push({
        type: 'BIDIAGNOSE',
        diagnose: vurdering.bidiagnoser,
        kodeverk: vurdering.kodeverk,
      });
    }

    return result;
  });
}

export function finnDiagnoseGrunnlagForStudent(grunnlag: StudentGrunnlag): Diagnoser[] {
  return grunnlag.nyeVurderinger.flatMap((vurdering) => {
    const result: Diagnoser[] = [];

    if (vurdering.hoveddiagnose && vurdering.kodeverk) {
      result.push({
        type: 'HOVEDDIAGNOSE',
        diagnose: vurdering.hoveddiagnose,
        kodeverk: vurdering.kodeverk,
      });
    }

    if (vurdering.bidiagnoser && vurdering.kodeverk) {
      result.push({
        type: 'BIDIAGNOSE',
        diagnose: vurdering.bidiagnoser,
        kodeverk: vurdering.kodeverk,
      });
    }

    return result;
  });
}
