import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';
import { Aktivitetsmeldinger } from 'lib/types/types';

export const defaultAktiviteter: Aktivitetsmeldinger = {
  hammere: [
    {
      type: 'IKKE_MØTT_TIL_MØTE',
      dato: '02.04.2024',
      begrunnelse: 'En begrunnelse',
    },
    {
      type: 'IKKE_MØTT_TIL_ANNEN_AKTIVITET',
      dato: '10.04.2024',
      begrunnelse: 'En begrunnelse',
    },
    {
      type: 'IKKE_MØTT_TIL_MØTE',
      dato: '15.04.2024',
      begrunnelse: 'En begrunnelse',
    },
    {
      type: 'IKKE_AKTIVT_BIDRAG',
      dato: '22.04.2024',
      begrunnelse: 'En begrunnelse',
    },
  ],
};
describe('Aktivitetstabell', () => {
  it('Skal rendre en tabell', () => {
    render(<AktivitetsTabell aktivitetsmeldinger={defaultAktiviteter} />);
    const headers = ['Årsak', 'Dato', 'Sendt forh.varsel', 'Sendt vedtak'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });

  it('Skal rendre en rad per dokument', () => {
    render(<AktivitetsTabell aktivitetsmeldinger={defaultAktiviteter} />);
    expect(screen.getAllByRole('row')).toHaveLength(5); // Inkluderer table header row
  });
});
