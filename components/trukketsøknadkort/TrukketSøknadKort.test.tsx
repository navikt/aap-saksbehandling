import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrukketSøknadKort } from 'components/trukketsøknadkort/TrukketSøknadKort';

describe('Statuskort for trukket søknad', () => {
  it('har en overskrift', () => {
    render(<TrukketSøknadKort grunnlag={{ begrunnelse: 'En begrunnelsestekst' }} />);
    expect(screen.getByRole('heading', { name: 'Søknaden er trukket' })).toBeVisible();
  });

  it('skal vise begrunnelse på hvorfor søknaden ble trukket', () => {
    render(<TrukketSøknadKort grunnlag={{ begrunnelse: 'En begrunnelsestekst' }} />);
    expect(screen.getByText('En begrunnelsestekst')).toBeVisible();
  });
});
