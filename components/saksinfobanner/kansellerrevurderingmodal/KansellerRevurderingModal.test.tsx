import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KansellerRevurderingModal } from './KansellerRevurderingModal';

describe('Kanseller revurdering', () => {
  beforeEach(() =>
    render(<KansellerRevurderingModal saksnummer={'1'} behandlingReferanse={'1'} isOpen={true} onClose={vi.fn} />)
  );
  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Er du sikker på at du vil kansellere revurderingen?' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at revurderingen kanselleres', () => {
    expect(screen.getByRole('button', { name: 'Kanseller revurdering' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });
});
