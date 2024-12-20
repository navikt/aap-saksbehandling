import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      tom: undefined,
    },
  },
];

describe('AktivitetspliktHendelserTabell', () => {
  it('skal inneholde korrekte columnheaders', () => {
    render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
    const paragraf = screen.getByRole('columnheader', {
      name: '§',
    });

    expect(paragraf).toBeVisible();

    const brudd = screen.getByRole('columnheader', {
      name: 'Brudd',
    });

    expect(brudd).toBeVisible();

    const grunn = screen.getByRole('columnheader', {
      name: 'Grunn',
    });

    expect(grunn).toBeVisible();

    const begrunelse = screen.getByRole('columnheader', {
      name: 'Begrunnelse',
    });

    expect(begrunelse).toBeVisible();

    const periode = screen.getByRole('columnheader', {
      name: 'Periode',
    });

    expect(periode).toBeVisible();
  });

  it('skal inneholde en rad med verdier dersom det finnes en hendelse', () => {
    render(<AktivitetspliktHendelserTabell aktivitetspliktHendelser={aktivitetspliktHendelser} />);
    const paragrafVerdi = screen.getByRole('cell', { name: '11-7' });
    expect(paragrafVerdi).toBeVisible();

    const bruddVerdi = screen.getByRole('cell', { name: 'Ikke bidratt til egen avklaring' });
    expect(bruddVerdi).toBeVisible();

    const grunnVerdi = screen.getByRole('cell', { name: 'Ingen gyldig grunn' });
    expect(grunnVerdi).toBeVisible();

    const begrunnelseVerdi = screen.getByRole('cell', { name: 'Dette er en begrunnelse' });
    expect(begrunnelseVerdi).toBeVisible();

    const periodeVerdi = screen.getByRole('cell', { name: '04.10.2024 -' });
    expect(periodeVerdi).toBeVisible();
  });
});
