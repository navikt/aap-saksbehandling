import Fuse from 'fuse.js';
import { ICD10, ICPC2 } from '@navikt/diagnosekoder';
import { ValuePair } from '@navikt/aap-felles-react';

export type DiagnoseSystem = 'ICD10' | 'ICPC2';

const fuseICD10 = new Fuse(ICD10, { keys: ['code', 'text'], threshold: 0.2 });
const fuseICPC2 = new Fuse(ICPC2, { keys: ['code', 'text'], threshold: 0.2 });

export function diagnoseSøker(system: DiagnoseSystem, value: string): ValuePair[] {
  if (system === 'ICD10') {
    if ((value ?? '').trim() === '') {
      return ICD10.slice(0, 100).map((diagnose) => {
        return {
          label: diagnose.text,
          value: diagnose.code,
        };
      });
    } else {
      return fuseICD10
        .search(value)
        .slice(0, 100)
        .map((it) => it.item)
        .map((diagnose) => {
          return {
            label: diagnose.text,
            value: diagnose.code,
          };
        });
    }
  } else {
    if ((value ?? '').trim() === '') {
      return ICPC2.slice(0, 100).map((diagnose) => {
        return {
          label: diagnose.text,
          value: diagnose.code,
        };
      });
    } else {
      return fuseICPC2
        .search(value)
        .slice(0, 100)
        .map((it) => it.item)
        .map((diagnose) => {
          return {
            label: diagnose.text,
            value: diagnose.code,
          };
        });
    }
  }
}
