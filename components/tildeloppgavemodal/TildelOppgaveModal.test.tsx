import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';
import { act, screen } from '@testing-library/react';
import { TildelOppgaveModal } from 'components/tildeloppgavemodal/TildelOppgaveModal';
import { customRenderWithTildelOppgaveContext } from 'lib/test/CustomRender';

describe('tildelOppgaveModalTest', () => {
  it('skal ha en tildel-knapp og en avbryt-knapp', async () => {
    await act(async () => {
      customRenderWithTildelOppgaveContext(<TildelOppgaveModal revalidateFunction={vi.fn()} />, true);
    });
    const tildelKnapp = screen.getByRole('button', { name: /Tildel/i });
    expect(tildelKnapp).toBeVisible();

    const avbrytKnapp = screen.getByRole('button', { name: /Avbryt/i });
    expect(avbrytKnapp).toBeVisible();
  });

  it('skal ha søkefelt med søkeknapp', async () => {
    await act(async () => {
      customRenderWithTildelOppgaveContext(<TildelOppgaveModal revalidateFunction={vi.fn()} />, true);
    });
    const searchButton = screen.getByRole('button', { name: /søk/i });
    expect(searchButton).toBeInTheDocument();
  });
});
