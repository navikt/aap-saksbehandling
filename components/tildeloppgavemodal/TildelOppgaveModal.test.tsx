import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

describe('tildelOppgaveModalTest', () => {
  it('skal ha en tildel-knapp og en avbryt-knapp', () => {
    render(
      <TildelOppgaveModal
        oppgaveIder={[1]}
        isOpen={true}
        onClose={vi.fn()}
        setValgteRader={vi.fn()}
        skalFjerneValgteRader={false}
      />
    );
    const tildelKnapp = screen.getByRole('button', { name: /Tildel/i });
    expect(tildelKnapp).toBeVisible();

    const avbrytKnapp = screen.getByRole('button', { name: /Avbryt/i });
    expect(avbrytKnapp).toBeVisible();
  });

  it('skal ha søkefelt med søkeknapp', () => {
    render(
      <TildelOppgaveModal
        oppgaveIder={[1]}
        isOpen={true}
        onClose={vi.fn()}
        setValgteRader={vi.fn()}
        skalFjerneValgteRader={false}
      />
    );
    const searchButton = screen.getByRole('button', { name: /søk/i });
    expect(searchButton).toBeInTheDocument();
  });
});
