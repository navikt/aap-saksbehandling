import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { RedigerYtelseModal, SamordnetYtelseFormFields } from './RedigerYtelseModal';
import { SamordnetYtelse } from './SamordningGradering';

const user = userEvent.setup();

describe('RedigerYtelseModal', () => {
  test('viser "Legg til periode" som tittel og knappetekst når det ikke finnes initialValues', () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Legg til periode' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Legg til periode' })).toBeVisible();
  });

  test('viser "Rediger periode" som tittel og fyller ut feltene med initialValues', () => {
    const initialValues: SamordnetYtelse = {
      ytelseType: 'SYKEPENGER',
      gradering: 20,
      periode: { fom: '2025-01-01', tom: '2025-01-31' },
    };

    render(<RedigerYtelseModal initialValues={initialValues} onLagre={vi.fn()} onLukk={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Rediger periode' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Lagre endringer' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('SYKEPENGER');
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toHaveValue('2025-01-01');
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toHaveValue('2025-01-31');
    expect(screen.getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('20');
  });

  test('skjuler samordningsgrad når ytelsestype er Ferie i sykepengeperiode', async () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Ytelsestype' }), 'Ferie i sykepengeperiode');

    expect(screen.queryByRole('textbox', { name: 'Samordningsgrad' })).not.toBeInTheDocument();
  });

  test('viser samordningsgrad igjen når ytelsestype endres bort fra Ferie i sykepengeperiode', async () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    const ytelseType = screen.getByRole('combobox', { name: 'Ytelsestype' });
    await user.selectOptions(ytelseType, 'Ferie i sykepengeperiode');
    expect(screen.queryByRole('textbox', { name: 'Samordningsgrad' })).not.toBeInTheDocument();

    await user.selectOptions(ytelseType, 'Sykepenger');
    expect(screen.getByRole('textbox', { name: 'Samordningsgrad' })).toBeVisible();
  });

  test('kan lagre en periode med Ferie i sykepengeperiode uten å oppgi samordningsgrad', async () => {
    const onLagre = vi.fn();
    render(<RedigerYtelseModal onLagre={onLagre} onLukk={vi.fn()} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Ytelsestype' }), 'Ferie i sykepengeperiode');

    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.06.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '14.06.2025');

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(onLagre).toHaveBeenCalledWith(
      expect.objectContaining<Partial<SamordnetYtelseFormFields>>({
        ytelseType: 'FERIE_I_SYKEPENGEPERIODE',
        fom: '01.06.2025',
        tom: '14.06.2025',
      }),
      expect.anything()
    );
    expect(onLagre.mock.calls[0][0].gradering).toBeUndefined();
  });

  test('gir feilmelding når påkrevde felt mangler ved innsending', async () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(await screen.findByText('Du må velge dato for periodestart')).toBeVisible();
    expect(await screen.findByText('Du må velge dato for periodeslutt')).toBeVisible();
    expect(await screen.findByText('Du må velge en ytelsetype')).toBeVisible();
  });

  test('gir feilmelding når samordningsgrad ikke er et gyldig tall mellom 0 og 100', async () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.selectOptions(screen.getByRole('combobox', { name: 'Ytelsestype' }), 'Sykepenger');
    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.01.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '31.01.2025');

    const gradering = screen.getByRole('textbox', { name: 'Samordningsgrad' });
    await user.type(gradering, '150');
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(await screen.findByText('Samordningsgrad kan ikke være mer enn 100%')).toBeVisible();
  });

  test('gir feilmelding når fra og med er etter til og med', async () => {
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={vi.fn()} />);

    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '31.10.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '01.10.2025');
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    expect(await screen.findByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
  });

  test('kaller onLukk når Avbryt trykkes', async () => {
    const onLukk = vi.fn();
    render(<RedigerYtelseModal onLagre={vi.fn()} onLukk={onLukk} />);

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(onLukk).toHaveBeenCalled();
  });
});
