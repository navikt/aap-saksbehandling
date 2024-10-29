import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { userEvent } from '@testing-library/user-event';

describe('aktivitetsmelding', () => {
  const user = userEvent.setup();

  it('skal ha en tabell for tidligere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const overskriftTabell = screen.getByText('Tidligere brudd på aktivitetsplikten');
    expect(overskriftTabell).toBeVisible();
  });

  it('skal ha et felt for å registrere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const felt = screen.getByRole('group', { name: /registrer brudd på aktivitetsplikt/i });
    expect(felt).toBeVisible();
  });

  it('skal ha alle valgene i feltet for å registrere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const ikkeMøtttilTiltakValg = screen.getByRole('radio', { name: /ikke møtt i tiltak/i });
    expect(ikkeMøtttilTiltakValg).toBeVisible();

    const ikkeMøttIBehandlingValg = screen.getByRole('radio', { name: /ikke møtt i behandling\/ utredning/i });
    expect(ikkeMøttIBehandlingValg).toBeVisible();

    const ikkeMøttTilMøteMedNavFelt = screen.getByRole('radio', { name: /ikke møtt til møte med nav/i });
    expect(ikkeMøttTilMøteMedNavFelt).toBeVisible();

    const ikkeSendtInnDokumentasjonFelt = screen.getByRole('radio', {
      name: /bruker har ikke sendt inn dokumentasjon som nav har bedt om på aktivitet/i,
    });
    expect(ikkeSendtInnDokumentasjonFelt).toBeVisible();

    const ikkeBidrattTilEgenAvklaringFelt = screen.getByRole('radio', {
      name: /ikke bidratt til egen avklaring/i,
    });
    expect(ikkeBidrattTilEgenAvklaringFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en paragraf dersom man velger ikke møtt til tiltak', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragrafFelt = screen.getByRole('group', { name: /velg paragraf/i });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en grunn for fravær dersom man velger paragraf 11-8', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const grunnFelt = screen.getByRole('combobox', { name: /grunn/i });
    expect(grunnFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en paragraf dersom man velger ikke møtt i behandling/utredning', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragrafFelt = screen.getByRole('group', { name: /velg paragraf/i });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal ha alle valgene i feltet for hvilken paragraf', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragraf_11_8Felt = screen.getByRole('radio', { name: /11-8 fravær fra fastsatt aktivitet/i });
    expect(paragraf_11_8Felt).toBeVisible();

    const paragraf_11_9Felt = screen.getByRole('radio', {
      name: /11-9 reduksjon av aap ved brudd på nærmere bestemte aktivitetsplikter/i,
    });
    expect(paragraf_11_9Felt).toBeVisible();
  });

  it('skal dukke opp et begrunnelsesfelt for brudd på aktivitetsplikt dersom man velger en paragraf', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const felt = screen.getByRole('textbox', { name: /begrunnelse/i });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må registrere et brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom hvilken paragraf det gjelder ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må velge en paragraf');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom dato for brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const enkeltDatoKnapp = screen.getByRole('button', { name: /legg til enkeltdato/i });
    await user.click(enkeltDatoKnapp);

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må sette en dato');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom begrunnelse ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });

  it('skal være mulig å legge til flere rader med enkeltdato', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilEnkeltdatoKnapp = screen.getByRole('button', { name: /legg til enkeltdato/i });
    await user.click(leggTilEnkeltdatoKnapp);
    await user.click(leggTilEnkeltdatoKnapp);
    const datoFelt = screen.getAllByRole('textbox', { name: /dato/i });
    expect(datoFelt.length).toEqual(2);
  });

  it('skal være mulig å slette en rad med enkeltdato', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilEnkeltdatoKnapp = screen.getByRole('button', { name: /legg til enkeltdato/i });
    await user.click(leggTilEnkeltdatoKnapp);
    await user.click(leggTilEnkeltdatoKnapp);
    expect(screen.getAllByRole('textbox', { name: /dato/i }).length).toEqual(2);

    const slettKnapp = screen.getAllByRole('button', { name: /slett/i });
    await user.click(slettKnapp[0]);
    expect(screen.getAllByRole('textbox', { name: /dato/i }).length).toEqual(1);
  });

  it('skal være mulig å legge til flere rader med perioder', async () => {
    await render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: /legg til periode/i });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);
    const fraOgMedDatoFelt = screen.getAllByRole('textbox', { name: /fra og med dato/i });
    const tilOgMedDatoFelt = screen.getAllByRole('textbox', { name: /til og med dato/i });
    expect(fraOgMedDatoFelt.length).toEqual(2);
    expect(tilOgMedDatoFelt.length).toEqual(2);
  });

  it('skal være mulig å slette en rad med perioder', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: /legg til periode/i });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);

    expect(screen.getAllByRole('textbox', { name: /fra og med dato/i }).length).toEqual(2);
    expect(screen.getAllByRole('textbox', { name: /til og med dato/i }).length).toEqual(2);

    const slettKnapp = screen.getAllByRole('button', { name: /slett/i });
    await user.click(slettKnapp[0]);

    expect(screen.getAllByRole('textbox', { name: /fra og med dato/i }).length).toEqual(1);
    expect(screen.getAllByRole('textbox', { name: /til og med dato/i }).length).toEqual(1);
  });

  it('skal vise en feilmelding dersom det finnes overlappende perioder', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const group = screen.getByRole('group', {
      name: /grunn/i,
    });

    const sykdomEllerskadeValg = within(group).getByText(/sykdom eller skade/i);
    await user.click(sykdomEllerskadeValg);

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: /legg til periode/i });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);

    const fraOgMedFelt = screen.getAllByRole('textbox', { name: /fra og med dato/i });
    const tilOgMedFelt = screen.getAllByRole('textbox', { name: /til og med dato/i });

    await user.type(fraOgMedFelt[0], '01.01.2020');
    await user.type(tilOgMedFelt[0], '01.02.2020');

    await user.type(fraOgMedFelt[1], '15.01.2020');
    await user.type(tilOgMedFelt[1], '24.02.2020');

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /begrunnelse/i,
    });

    await user.type(begrunnelseFelt, 'Dette er en begrunnelse');
    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Det finnes overlappende perioder');
    expect(feilmelding).toBeVisible();
  });

  async function velgIkkeMøttITiltakSomBrudd() {
    const ikkeMøttilTiltakValg = screen.getByRole('radio', { name: /ikke møtt i tiltak/i });
    await user.click(ikkeMøttilTiltakValg);
  }

  async function velgParagraf_11_8() {
    const paragraf_11_8Felt = screen.getByRole('radio', { name: /11-8 fravær fra fastsatt aktivitet/i });
    await user.click(paragraf_11_8Felt);
  }
});
