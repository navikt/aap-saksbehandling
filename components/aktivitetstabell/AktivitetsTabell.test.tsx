import { render, screen } from '@testing-library/react';

import { AktivitetsTabell } from 'components/aktivitetstabell/AktivitetsTabell';

describe('Aktivitetstabell', () => {
  it('Skal rendre en tabell', () => {
    render(<AktivitetsTabell />);
    const headers = ['Årsak', 'Dato', 'Sendt forh.varsel', 'Sendt vedtak'];
    headers.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: new RegExp(`^${header}$`) })).toBeVisible();
    });
  });

  it('Skal rendre en rad per dokument', () => {
    render(<AktivitetsTabell />);
    expect(screen.getAllByRole('row')).toHaveLength(5); // Inkluderer table header row
  });
});
