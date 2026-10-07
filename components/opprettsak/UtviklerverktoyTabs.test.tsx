import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { UtviklerverktoyTabs } from 'components/opprettsak/UtviklerverktoyTabs';

const user = userEvent.setup();

describe('UtviklerverktoyTabs', () => {
  it('viser begge fanene, med Opprett sak valgt som standard', () => {
    render(<UtviklerverktoyTabs />);

    expect(screen.getByText('Utviklerverktøy')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Opprett sak' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' })).toHaveAttribute('aria-selected', 'false');

    expect(screen.getByRole('button', { name: 'Opprett og iverksett' })).toBeInTheDocument();
    expect(screen.queryByText('Postmottak må kjøre')).not.toBeInTheDocument();
  });

  it('bytter til Simuler journalpost-hendelse-panelet ved klikk på fanen', async () => {
    render(<UtviklerverktoyTabs />);

    await user.click(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' }));

    expect(screen.getByRole('tab', { name: 'Simuler journalpost-hendelse' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Postmottak må kjøre')).toBeInTheDocument();
  });
});
