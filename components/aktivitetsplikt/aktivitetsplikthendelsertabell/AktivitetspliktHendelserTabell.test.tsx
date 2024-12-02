import { describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  AktivitetspliktHendelserMedFormId,
  AktivitetspliktHendelserTabell,
} from 'components/aktivitetsplikt/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';

const aktivitetspliktHendelser: AktivitetspliktHendelserMedFormId[] = [
  {
    id: 'hello',
    brudd: 'IKKE_AKTIVT_BIDRAG',
    paragraf: 'PARAGRAF_11_7',
    grunn: 'INGEN_GYLDIG_GRUNN',
    begrunnelse: 'Dette er en begrunnelse',
    periode: {
      fom: '2024-10-04',
      tom: '2024-10-04',
    },
  },
];

describe.skip('Aktivitetstabell', () => {
  render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
});

describe.skip('felt for om det er en feilregistrering', () => {
  render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
});

describe.skip('felt for hvilken grunn til brudd', () => {
  render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
});
