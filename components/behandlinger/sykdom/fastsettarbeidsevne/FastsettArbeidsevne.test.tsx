import { describe, it, expect, beforeEach } from 'vitest';
import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('FastsettArbeidsevne', () => {
  beforeEach(() => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
  });
  const user = userEvent.setup();

  it('Skal ha riktig heading', () => {
    const heading = screen.getByRole('heading', {
      name: 'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)',
      level: 3,
    });
    expect(heading).toBeVisible();
  });

  it('Steget skal være default lukket', () => {
    const textbox = screen.queryByRole('textbox', {
      name: /Hvor stor er arbeidsevnen sett opp mot en arbeidsuke på 37,5 timer/i,
    });
    expect(textbox).toBeNull();
  });

  it('har et felt hvor saksbehandler skal begrunne om innbygger har arbeidsevne', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Vurder om innbygger har arbeidsevne' })).toBeVisible();
  });

  it('begrunnelsesfeltet har en beskrivelse', async () => {
    await åpneVilkårskort();
    expect(
      screen.getByText('Hvis ikke annet er oppgitt, så antas innbygger å ha 0% arbeidsevne og rett på full ytelse')
    ).toBeVisible();
  });

  it('har et felt for å angi arbeidsevne', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Arbeidsevne' })).toBeVisible();
  });

  it('har et felt for å angi enhet for arbeidsevne', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('combobox', { name: 'Enhet' })).toBeVisible();
  });

  it('har et felt for å angi når arbeidsevnen gjelder fra', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Arbeidsevne gjelder fra' })).toBeVisible();
  });

  describe('validering', () => {
    it('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      await åpneVilkårskort();
      await klikkPåBekreft();
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    it('viser feilmelding når arbeidsevne ikke er besvart', async () => {
      await åpneVilkårskort();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi hvor stor arbeidsevne innbygger har')).toBeVisible();
    });

    // TODO må sjekke hva som skal være default her. Tomt? Prosent? Time?
    it.skip('viser feilmelding dersom enhet ikke er fylt ut', async () => {
      await åpneVilkårskort();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi en enhet for arbeidsevnen')).toBeVisible();
    });

    it('viser feilmelding dersom dato når arbeidsevnen gjelder fra ikke er besvart', async () => {
      await åpneVilkårskort();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi datoen arbeidsevnen gjelder fra')).toBeVisible();
    });
  });

  async function klikkPåBekreft() {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
  }

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', {
      name: 'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)',
    });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
