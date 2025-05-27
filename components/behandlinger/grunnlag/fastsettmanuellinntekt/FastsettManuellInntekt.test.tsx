import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { ManuellInntektGrunnlag } from 'lib/types/types';

describe('Fastsett manuell inntekt', () => {
  const user = userEvent.setup();
  const grunnlag: ManuellInntektGrunnlag = {
    ar: 0,
    gverdi: 100000,
    harTilgangTilÅSaksbehandle: true,
  };

  beforeEach(() => render(<FastsettManuellInntekt behandlingsversjon={1} grunnlag={grunnlag} />));

  it('skal ha en alert', () => {
    const alert = screen.getByText(
      'Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert. Om bruker ikke har hatt inntekt for gitt år, legg inn 0.'
    );
    expect(alert).toBeVisible();
  });

  it('skal ha et felt for begrunnelse', () => {
    const felt = screen.getByRole('textbox', { name: 'Begrunn inntekt for siste beregningsår' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for begrunnelse dersom det ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må gi en begrunnelse.');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å oppgi inntekt', () => {
    const felt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for å oppgi inntekt dersom det ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må oppgi inntekt for det siste året.');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise G verdi på hva som har blitt skrevet inn', async () => {
    const felt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });

    expect(screen.getByText('0.00 G')).toBeVisible();

    await user.type(felt, '200 000');

    expect(screen.getByText('2.00 G')).toBeVisible();
  });
});

describe('Fastsett manuell inntekt vurdering', () => {
  const grunnlagMedVurdering: ManuellInntektGrunnlag = {
    ar: 0,
    gverdi: 100000,
    harTilgangTilÅSaksbehandle: true,
    vurdering: {
      ar: 2020,
      begrunnelse: 'Dette er en begrunnelse',
      vurdertAv: {
        dato: '2020-05-01',
        ident: 'Lokalsaksbehandler',
      },
      belop: 500000,
    },
  };

  beforeEach(() => render(<FastsettManuellInntekt behandlingsversjon={1} grunnlag={grunnlagMedVurdering} />));

  it('skal vise hvem som har gjort vurderingen dersom det har blitt gjort en vurdering', () => {
    const vurdertAvTekst = screen.getByText('Vurdert av Lokalsaksbehandler (Nay), 01.05.2020');
    expect(vurdertAvTekst).toBeVisible();
  });

  it('feltene skal ha default value dersom vurdering har blitt gjort', () => {
    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Begrunn inntekt for siste beregningsår' });
    expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');

    const inntektFelt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });
    expect(inntektFelt).toHaveValue(500000);
  });
});
