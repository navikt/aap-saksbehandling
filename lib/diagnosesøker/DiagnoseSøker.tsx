import Fuse from 'fuse.js';
import { ICD10, ICD10Diagnosekode, ICPC2, ICPC2Diagnosekode } from '@navikt/diagnosekoder';
import { ValuePair } from '@navikt/aap-felles-react';

export type DiagnoseSystem = 'ICD10' | 'ICPC2';

const fuseOptions = { keys: ['code', 'text'], threshold: 0.2 };
const fuseICD10 = new Fuse(ICD10, fuseOptions);
const fuseICPC2 = new Fuse(ICPC2, fuseOptions);

const ingenDiagnoseOption: ValuePair = { label: 'Ingen diagnose', value: 'INGEN_DIAGNOSE' };

export function diagnoseSøker(kodeverk: DiagnoseSystem, value: string): ValuePair[] {
  const erValueTom = (value ?? '').trim() === '';
  const data = kodeverk === 'ICD10' ? ICD10 : ICPC2;
  const fuse = kodeverk === 'ICD10' ? fuseICD10 : fuseICPC2;

  const diagnoses = erValueTom
    ? []
    : fuse
        .search(value)
        .slice(0, 49)
        .map((result) => result.item);

  if (erValueTom) {
    return [
      ingenDiagnoseOption,
      ...diagnoses.map(mapDiagnoseToValuePair),
      ...(erValueTom ? data.slice(0, 49).map(mapDiagnoseToValuePair) : []),
    ];
  }

  return [
    ...diagnoses.map(mapDiagnoseToValuePair),
    ...(erValueTom ? data.slice(0, 49).map(mapDiagnoseToValuePair) : []),
  ];
}

function mapDiagnoseToValuePair(value: ICPC2Diagnosekode | ICD10Diagnosekode): ValuePair {
  return {
    label: `${value.text} (${value.code})`,
    value: value.code,
  };
}
