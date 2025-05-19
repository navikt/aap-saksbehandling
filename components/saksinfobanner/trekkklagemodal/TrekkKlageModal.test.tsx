import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrekkKlageModal } from 'components/saksinfobanner/trekkklagemodal/TrekkKlageModal';

describe('Trekk klage', () => {
  beforeEach(() =>
    render(<TrekkKlageModal saksnummer={'1'} behandlingReferanse={'2'} isOpen={true} onClose={vi.fn} />)
  );

  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Er du sikker på at du vil trekke klagen?' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at klagen skal trekkes', () => {
    expect(screen.getByRole('button', { name: 'Trekk klage' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});
