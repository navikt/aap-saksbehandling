import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VurderRettighetsperiodeModal } from './VurderRettighetsperiodeModal';

describe('Vurder rettighetsperiode', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <VurderRettighetsperiodeModal behandlingReferanse={'213'} saksnummer={'1'} isOpen={true} onClose={vi.fn} />
      );
    });
  });
  it('har en overskrift', () => {
    expect(
      screen.getByRole('heading', { name: 'Vurder § 22-13 syvende ledd. Første mulige dato med rett til ytelse' })
    ).toBeVisible();
  });

  it('har en knapp for å bekrefte at rettighetsperioden skal endres', () => {
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });

  it('har en knapp for å avbryte', () => {
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });

  it('validerer skjemaet fra bekreft-knappen i dialogens footer', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må gi en kommentar til saksbehandler')).toBeVisible();
  });
});
