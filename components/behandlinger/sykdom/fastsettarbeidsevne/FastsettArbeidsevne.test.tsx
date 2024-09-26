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

  it('har en rad i tabellen som initiell tilstand hvis det ikke finnes noe data', async () => {
    await åpneVilkårskort();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('har en knapp for å legge til nye perioder', async () => {
    await åpneVilkårskort();
    expect(screen.getByRole('button', { name: 'Legg til periode' })).toBeVisible();
  });

  it('klikk på knapp for å legge til en rad legger til en rad', async () => {
    await åpneVilkårskort();
    expect(screen.getAllByRole('row')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  describe('Periodetabell', () => {
    it('har et input-felt for arbeidsevne', async () => {
      await åpneVilkårskort();
      expect(screen.getByRole('textbox', { name: 'Arbeidsevne' })).toBeVisible();
    });

    it('har et select-element for å velge enhet for arbeidsevne', async () => {
      await åpneVilkårskort();
      expect(screen.getByRole('combobox', { name: 'Enhet' })).toBeVisible();
    });

    it('har et felt for når perioden starter', async () => {
      await åpneVilkårskort();
      expect(screen.getByRole('textbox', { name: 'Gjelder fra' })).toBeVisible();
    });

    it('har et felt for når perioden slutter', async () => {
      await åpneVilkårskort();
      expect(screen.getByRole('textbox', { name: 'Til og med (valgfritt)' })).toBeVisible();
    });
  });

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', {
      name: 'Reduksjon av maks utbetalt ytelse ved delvis nedsatt arbeidsevne § 11-23 2.ledd (valgfritt)',
    });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
