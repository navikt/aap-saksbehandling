import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinnSak } from './FinnSak';
import { FinnSakGrunnlag } from 'lib/types/postmottakTypes';

describe('FinnSak', () => {
  const grunnlag = {
    saksinfo: [{ saksnummer: '23424', periode: { fom: 'Dawn of time', tom: 'End of time' } }],
  } as FinnSakGrunnlag;

  it('Skal ha en oversikt', () => {
    render(<FinnSak behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByText('Avklar sak');
    expect(heading).toBeVisible();
  });
  it('Har et valg for å knytte dokumentet til sak', () => {
    render(<FinnSak behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    expect(screen.getByRole('group', { name: 'Journalfør dokumentet på sak' })).toBeVisible();
  });
});
