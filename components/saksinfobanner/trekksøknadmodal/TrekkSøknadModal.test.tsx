import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrekkSøknadModal } from 'components/saksinfobanner/trekksøknadmodal/TrekkSøknadModal';

describe('Trekk søknad', () => {
  beforeEach(() =>
    render(<TrekkSøknadModal saksnummer={'1'} behandlingReferanse={'1'} isOpen={true} onClose={vi.fn} />)
  );
  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Er du sikker på at du vil trekke søknaden?' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at søknaden skal trekkes', () => {
    expect(screen.getByRole('button', { name: 'Trekk søknad' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});
