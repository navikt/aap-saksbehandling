import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrekkSøknad } from 'components/saksinfobanner/trekksoknad/TrekkSøknad';

describe('Trekk søknad', () => {
  beforeEach(() => render(<TrekkSøknad isOpen={true} onClose={vi.fn} />));
  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Trekk søknad' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at søknaden skal trekkes', () => {
    expect(screen.getByRole('button', { name: 'Trekk søknad' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});
