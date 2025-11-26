import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvbrytRevurderingModal } from 'components/saksinfobanner/avbrytrevurderingmodal/AvbrytRevurderingModal';

describe('Avbryt revurdering', () => {
  beforeEach(() =>
    render(<AvbrytRevurderingModal saksnummer={'1'} behandlingReferanse={'1'} isOpen={true} onClose={vi.fn} />)
  );
  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: 'Er du sikker på at du vil avbryte revurderingen?' })).toBeVisible();
  });

  it('har en knapp for å bekrefte at revurderingen avbrytes', () => {
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });
});
