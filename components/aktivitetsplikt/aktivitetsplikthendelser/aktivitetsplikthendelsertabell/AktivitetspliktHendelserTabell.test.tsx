import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { AktivitetspliktHendelserTabell } from 'components/aktivitetsplikt/aktivitetsplikthendelser/aktivitetsplikthendelsertabell/AktivitetspliktHendelserTabell';
import { AktivitetspliktHendelserMedFormId } from 'components/aktivitetsplikt/aktivitetsplikthendelser/AktivitetspliktHendelser';

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

// TODO Thomas skriv tester for det her
describe.skip('AktivitetspliktHendelserTabell', () => {
  it('skal gjøre noe', () => {
    render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
  });
});
