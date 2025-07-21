import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvklarSak } from 'components/postmottak/avklarsak/AvklarSak';
import { FinnSakGrunnlag } from 'lib/types/postmottakTypes';

describe('Avklar sak', () => {
  const grunnlag: FinnSakGrunnlag = {
    dokumenter: [],
    saksinfo: [{ saksnummer: '23424', periode: { fom: '2025-01-01', tom: '2025-02-01' } }],
    brevkode: '',
  };

  it('Skal ha en oversikt', () => {
    render(<AvklarSak behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    const heading = screen.getByText('Avklar sak og journalpostdetaljer');
    expect(heading).toBeVisible();
  });

  it('Har et valg for å knytte dokumentet til sak', () => {
    render(<AvklarSak behandlingsVersjon={1} behandlingsreferanse={'123'} grunnlag={grunnlag} readOnly={false} />);
    expect(screen.getByRole('group', { name: 'Hvor skal dokumentet journalføres?' })).toBeVisible();
  });
});
