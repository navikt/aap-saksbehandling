import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';

describe('Fastsett manuell inntekt', () => {
  const user = userEvent.setup();

  it('skal ha en alert', () => {
    render(<FastsettManuellInntekt behandlingsversjon={1} />);
    const alert = screen.getByText(
      'Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert.'
    );
    expect(alert).toBeVisible();
  });

  it('skal ha et felt for begrunnelse', () => {
    render(<FastsettManuellInntekt behandlingsversjon={1} />);
    const felt = screen.getByRole('textbox', { name: 'Begrunn inntekt for siste beregningsår' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for begrunnelse dersom det ikke er besvart', async () => {
    render(<FastsettManuellInntekt behandlingsversjon={1} />);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må gi en begrunnelse.');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å oppgi inntekt', () => {
    render(<FastsettManuellInntekt behandlingsversjon={1} />);
    const felt = screen.getByRole('textbox', { name: 'Oppgi inntekt' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for å oppgi inntekt dersom det ikke er besvart', async () => {
    render(<FastsettManuellInntekt behandlingsversjon={1} />);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må oppgi inntekt for det siste året.');
    expect(feilmelding).toBeVisible();
  });


});
