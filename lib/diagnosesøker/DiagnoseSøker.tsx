import Fuse from 'fuse.js';
import { ICD10, ICD10Diagnosekode, ICPC2, ICPC2Diagnosekode } from '@navikt/diagnosekoder';
import { ValuePair } from '@navikt/aap-felles-react';

export type DiagnoseSystem = 'ICD10' | 'ICPC2';

export type DiagnoseOption = { text: string; code: string } | ICPC2Diagnosekode | ICD10Diagnosekode;

// Trekker ut denne som en konstant for å gi mer sikkerhet ved bruk i render-metoden i sykdom og mapDiagnoseToValuePair
export const ingenDiagnoseCode = 'INGEN_DIAGNOSE';

const ingenDiagnoseOption = {
  text: 'Ingen diagnose',
  code: ingenDiagnoseCode,
};

const ICD10options = [ingenDiagnoseOption, ...ICD10];
const ICPC2Options = [ingenDiagnoseOption, ...ICPC2];

const fuseOptions = { keys: ['code', 'text'], threshold: 0.2 };
const fuseICD10 = new Fuse(ICD10options, fuseOptions);
const fuseICPC2 = new Fuse(ICPC2Options, fuseOptions);

export function diagnoseSøker(kodeverk: DiagnoseSystem, value: string): ValuePair[] {
  const erValueTom = (value ?? '').trim() === '';
  const data = kodeverk === 'ICD10' ? ICD10options : ICPC2Options;
  const fuse = kodeverk === 'ICD10' ? fuseICD10 : fuseICPC2;

  const diagnoses = erValueTom
    ? []
    : fuse
        .search(value)
        .slice(0, 50)
        .map((result) => result.item);

  if (erValueTom) {
    return [
      ...diagnoses.map(mapDiagnoseToValuePair),
      ...(erValueTom ? data.slice(0, 50).map(mapDiagnoseToValuePair) : []),
    ];
  }

  return [
    ...diagnoses.map(mapDiagnoseToValuePair),
    ...(erValueTom ? data.slice(0, 50).map(mapDiagnoseToValuePair) : []),
  ];
}

function mapDiagnoseToValuePair(value: DiagnoseOption): ValuePair {
  // Vi trenger ikke å vise koden i label på ingen diagnose valget
  if (value.code === ingenDiagnoseCode) {
    return {
      label: value.text,
      value: value.code,
    };
  } else {
    return {
      label: `${value.text} (${value.code})`,
      value: value.code,
    };
  }
}
