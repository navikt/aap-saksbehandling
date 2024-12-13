import Fuse from 'fuse.js';
import { ICD10, ICD10Diagnosekode, ICPC2, ICPC2Diagnosekode } from '@navikt/diagnosekoder';
import { ValuePair } from '@navikt/aap-felles-react';

export type DiagnoseSystem = 'ICD10' | 'ICPC2';

const fuseICD10 = new Fuse(ICD10, { keys: ['code', 'text'], threshold: 0.2 });
const fuseICPC2 = new Fuse(ICPC2, { keys: ['code', 'text'], threshold: 0.2 });

export function diagnoseSøker(kodeverk: DiagnoseSystem, value: string): ValuePair[] {
  if (kodeverk === 'ICD10') {
    if ((value ?? '').trim() === '') {
      return ICD10.slice(0, 50).map((diagnose) => {
        return mapDiagnoseToValuePair(diagnose);
      });
    } else {
      return fuseICD10
        .search(value)
        .slice(0, 50)
        .map((it) => it.item)
        .map((diagnose) => {
          return mapDiagnoseToValuePair(diagnose);
        });
    }
  } else {
    if ((value ?? '').trim() === '') {
      return ICPC2.slice(0, 50).map((diagnose) => {
        return mapDiagnoseToValuePair(diagnose);
      });
    } else {
      return fuseICPC2
        .search(value)
        .slice(0, 50)
        .map((it) => it.item)
        .map((diagnose) => {
          return mapDiagnoseToValuePair(diagnose);
        });
    }
  }
}

function mapDiagnoseToValuePair(value: ICPC2Diagnosekode | ICD10Diagnosekode): ValuePair {
  return {
    label: `${value.text} (${value.code})`,
    value: value.code,
  };
}
