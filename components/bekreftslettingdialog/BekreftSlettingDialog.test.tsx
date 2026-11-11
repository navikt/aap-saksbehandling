import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { BekreftSlettingDialog } from './BekreftSlettingDialog';

describe('BekreftSlettingDialog', () => {
  test('sletter og lukker ved bekreftelse', async () => {
    const user = userEvent.setup();
    const onSlett = vi.fn();
    const onLukk = vi.fn();
    render(<BekreftSlettingDialog onSlett={onSlett} onLukk={onLukk} />);

    expect(screen.getByRole('dialog', { name: 'Slett samordningsperiode' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Slett' }));

    expect(onSlett).toHaveBeenCalledOnce();
    expect(onLukk).toHaveBeenCalledOnce();
  });

  test('avbryter uten å slette', async () => {
    const user = userEvent.setup();
    const onSlett = vi.fn();
    const onLukk = vi.fn();
    render(<BekreftSlettingDialog onSlett={onSlett} onLukk={onLukk} />);

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(onLukk).toHaveBeenCalledOnce();
    expect(onSlett).not.toHaveBeenCalled();
  });

  test('lukker med Escape uten å slette', async () => {
    const user = userEvent.setup();
    const onSlett = vi.fn();
    const onLukk = vi.fn();
    render(<BekreftSlettingDialog onSlett={onSlett} onLukk={onLukk} />);

    await user.keyboard('{Escape}');

    expect(onLukk).toHaveBeenCalledOnce();
    expect(onSlett).not.toHaveBeenCalled();
  });
});
