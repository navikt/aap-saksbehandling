import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { FerieISykepengeperiodeModal } from './FerieISykepengeperiodeModal';

const user = userEvent.setup();

describe('FerieISykepengeperiodeModal', () => {
  test('viser "Legg til ferie i sykepengeperiode" som tittel og knappetekst når det ikke finnes initialValues', () => {
    render(<FerieISykepengeperiodeModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Legg til ferie i sykepengeperiode' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Legg til periode' })).toBeVisible();
  });

  test('viser "Rediger ferie i sykepengeperiode" som tittel og fyller ut feltene med initialValues', () => {
    render(
      <FerieISykepengeperiodeModal
        initialValues={{ fom: '01.06.2025', tom: '14.06.2025' }}
        onLagre={vi.fn()}
        onLukk={vi.fn()}
      />
    );

    expect(screen.getByRole('heading', { name: 'Rediger ferie i sykepengeperiode' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Lagre endringer' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.06.2025');
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toHaveValue('14.06.2025');
  });

  test('kan lagre en periode uten å oppgi samordningsgrad eller ytelsestype', async () => {
    const onLagre = vi.fn();
    render(<FerieISykepengeperiodeModal onLagre={onLagre} onLukk={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.06.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '14.06.2025');

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(onLagre).toHaveBeenCalledWith({ fom: '01.06.2025', tom: '14.06.2025' }, expect.anything());
  });

  test('gir feilmelding når påkrevde felt mangler ved innsending', async () => {
    render(<FerieISykepengeperiodeModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(await screen.findByText('Du må velge dato for periodestart')).toBeVisible();
    expect(await screen.findByText('Du må velge dato for periodeslutt')).toBeVisible();
  });

  test('gir feilmelding når fra og med er etter til og med', async () => {
    render(<FerieISykepengeperiodeModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '31.10.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '01.10.2025');
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(await screen.findByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
  });

  test('kaller onLukk når Avbryt trykkes', async () => {
    const onLukk = vi.fn();
    render(<FerieISykepengeperiodeModal onLagre={vi.fn()} onLukk={onLukk} />);

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(onLukk).toHaveBeenCalled();
  });
});
