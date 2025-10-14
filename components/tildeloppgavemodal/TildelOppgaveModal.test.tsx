import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';
import { TildelOppgaverProvider } from 'context/oppgave/TildelOppgaverContext';

describe('tildelOppgaveModalTest', () => {
  it('skal ha en tildel-knapp og en avbryt-knapp', () => {
    render(
      <TildelOppgaverProvider>
        <TildelOppgaveModal />
      </TildelOppgaverProvider>
    );
    const tildelKnapp = screen.getByRole('button', { name: /Tildel/i });
    expect(tildelKnapp).toBeVisible();

    const avbrytKnapp = screen.getByRole('button', { name: /Avbryt/i });
    expect(avbrytKnapp).toBeVisible();
  });

  it('skal ha søkefelt med søkeknapp', () => {
    render(
      <TildelOppgaverProvider>
        <TildelOppgaveModal />
      </TildelOppgaverProvider>
    );
    const searchButton = screen.getByRole('button', { name: /søk/i });
    expect(searchButton).toBeInTheDocument();
  });
});
