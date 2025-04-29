import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VurderRettighetsperiodeModal } from './VurderRettighetsperiodeModal';

describe('Vurder rettighetsperiode', () => {
  beforeEach(() => render(<VurderRettighetsperiodeModal saksnummer={'1'} isOpen={true} onClose={vi.fn} />));
  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Endre starttidspunkt' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at rettighetsperioden skal endres', () => {
    expect(screen.getByRole('button', { name: 'Overstyr starttidspunkt' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});
