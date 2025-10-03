import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';

describe('tildelOppgaveModalTest', () => {
  it('skal ha en heading', () => {
    render(<TildelOppgaveModal oppgaveIder={[1]} isOpen={true} onClose={vi.fn()} />);
    const heading = screen.getByText('Tildel');
    expect(heading).toBeVisible();
  });

  it('skal ha søkefelt med søkeknapp', () => {
    render(<TildelOppgaveModal oppgaveIder={[1]} isOpen={true} onClose={vi.fn()} />);
    const searchButton = screen.getByRole('button', { name: /søk/i });
    expect(searchButton).toBeInTheDocument();
  });
});
