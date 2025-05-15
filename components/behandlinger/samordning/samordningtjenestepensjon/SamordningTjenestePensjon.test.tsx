import { describe, expect, it } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { SamordningTjenestePensjonGrunnlag } from 'lib/types/types';
import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import userEvent from '@testing-library/user-event';

const grunnlag: SamordningTjenestePensjonGrunnlag = {
  harTilgangTilÅSaksbehandle: false,
  tjenestepensjonYtelser: [
    {
      ytelse: 'ALDER',
      ordning: { navn: 'SPK', tpNr: '1234', orgNr: '1235' },
      ytelseIverksattFom: '2020-01-01',
      ytelseIverksattTom: '2020-02-02',
    },
  ],
};

describe('Refusjon tjenestepensjon', () => {
  const user = userEvent.setup();

  it('skal ha en tabell med kolonnene periode, ordning og ytelse', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} />);

    const periodeKolonne = screen.getByRole('columnheader', {
      name: 'Periode',
    });
    const ordningKolonne = screen.getByRole('columnheader', {
      name: 'Ordning',
    });
    const ytelseKolonne = screen.getByRole('columnheader', {
      name: 'Ytelse',
    });

    expect(periodeKolonne).toBeVisible();
    expect(ordningKolonne).toBeVisible();
    expect(ytelseKolonne).toBeVisible();
  });

  it('skal ha verdi i tabellen dersom det er tjenestepensjon ytelser', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} />);
    const periodeCelle = screen.getByRole('cell', {
      name: '01.01.2020 - 02.02.2020',
    });
    const ordningCelle = screen.getByRole('cell', {
      name: 'SPK',
    });
    const ytelseCelle = screen.getByRole('cell', {
      name: 'ALDER',
    });

    expect(periodeCelle).toBeVisible();
    expect(ordningCelle).toBeVisible();
    expect(ytelseCelle).toBeVisible();
  });

  it('skal ha et begrunnelse felt', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} />);
    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurdering' });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal ha et felt for om etterbetaling skal holdes igjen for perioden', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} />);
    const felt = screen.getByRole('group', { name: 'Skal etterbetaling holdes igjen for perioden?' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmeldinger dersom feltene ikke er besvart', async () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlag} behandlingVersjon={1} readOnly={false} />);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmeldingBegrunnelse = screen.getByText('Du må gi en begrunnelse.');
    const feilmeldingFeltForEtterbetaling = screen.getByText('Du må svare på om etterbetalingen skal holdes igjen.');
    expect(feilmeldingBegrunnelse).toBeVisible();
    expect(feilmeldingFeltForEtterbetaling).toBeVisible();
  });
});
