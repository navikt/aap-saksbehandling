import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Aktivitetsplikt } from 'components/aktivitetsplikt/Aktivitetsplikt';
import { userEvent } from '@testing-library/user-event';

const user = userEvent.setup();

describe('generelt', () => {
  it('skal ha en tabell for tidligere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const overskriftTabell = screen.getByText('Tidligere brudd på aktivitetsplikten');
    expect(overskriftTabell).toBeVisible();
  });
});

describe('Felt for å registrere brudd', () => {
  it('skal ha et felt for å registrere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const felt = screen.getByRole('group', { name: 'Registrer brudd på aktivitetsplikt' });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await trykkPåBekreftKnapp();
    const feilmelding = screen.getByText('Du må registrere et brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha alle valgene i feltet for å registrere brudd på aktivitetsplikten', () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    const ikkeMøtttilTiltakValg = screen.getByRole('radio', { name: 'Ikke møtt i tiltak' });
    expect(ikkeMøtttilTiltakValg).toBeVisible();

    const ikkeMøttIBehandlingValg = screen.getByRole('radio', { name: 'Ikke møtt i behandling/ utredning' });
    expect(ikkeMøttIBehandlingValg).toBeVisible();

    const ikkeMøttTilMøteMedNavFelt = screen.getByRole('radio', { name: 'Ikke møtt til møte med Nav' });
    expect(ikkeMøttTilMøteMedNavFelt).toBeVisible();

    const ikkeSendtInnDokumentasjonFelt = screen.getByRole('radio', {
      name: 'Bruker har ikke sendt inn dokumentasjon som Nav har bedt om på aktivitet',
    });
    expect(ikkeSendtInnDokumentasjonFelt).toBeVisible();

    const ikkeBidrattTilEgenAvklaringFelt = screen.getByRole('radio', {
      name: 'Ikke bidratt til egen avklaring',
    });
    expect(ikkeBidrattTilEgenAvklaringFelt).toBeVisible();

    const ikkeMøttTilAnnenAktivitet = screen.getByRole('radio', {
      name: 'Ikke møtt til annen aktivitet',
    });
    expect(ikkeMøttTilAnnenAktivitet).toBeVisible();
  });
});

describe('Felt for å velge paragraf', () => {
  it('skal dukke opp et felt for å velge en paragraf dersom man velger ikke møtt til tiltak', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragrafFelt = screen.getByRole('group', { name: 'Velg paragraf' });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en paragraf dersom man velger ikke møtt i behandling/utredning', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragrafFelt = screen.getByRole('group', { name: 'Velg paragraf' });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal ha alle valgene i feltet for hvilken paragraf', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragraf_11_8Felt = screen.getByRole('radio', { name: '11-8 fravær fra fastsatt aktivitet' });
    expect(paragraf_11_8Felt).toBeVisible();

    const paragraf_11_9Felt = screen.getByRole('radio', {
      name: '11-9 reduksjon av AAP ved brudd på nærmere bestemte aktivitetsplikter',
    });
    expect(paragraf_11_9Felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom hvilken paragraf det gjelder ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await trykkPåBekreftKnapp();
    const feilmelding = screen.getByText('Du må velge en paragraf');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å velge grunn', () => {
  it('skal dukke opp et felt for å velge en grunn for fravær dersom man velger paragraf 11-8', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const grunnFelt = screen.getByRole('group', { name: 'Velg grunn for bruddet' });
    expect(grunnFelt).toBeVisible();
  });

  it('Skal ha alle valgene i feltet for å registrere en grunn for bruddet', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const ingenGyldigGrunn = screen.getByRole('radio', { name: 'Ingen gyldig grunn' });
    expect(ingenGyldigGrunn).toBeVisible();

    const sykdomEllerSkade = screen.getByRole('radio', { name: 'Sykdom eller skade' });
    expect(sykdomEllerSkade).toBeVisible();

    const sterkeVelferdsgrunner = screen.getByRole('radio', { name: 'Sterke velferdsgrunner' });
    expect(sterkeVelferdsgrunner).toBeVisible();

    const rimeligGrunn = screen.getByRole('radio', { name: 'Rimelig grunn' });
    expect(rimeligGrunn).toBeVisible();
  });

  it('Skal vise en feilmelding dersom grunn ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();
    await trykkPåBekreftKnapp();

    const feilmelding = screen.getByText('Du må velge en grunn');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for begrunnelse', () => {
  it('skal dukke opp et begrunnelsesfelt for brudd på aktivitetsplikt dersom man velger en paragraf', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const felt = screen.getByRole('textbox', { name: 'Begrunnelse' });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom begrunnelse ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    await trykkPåBekreftKnapp();
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });
});

describe('Felt for å registrere enkeltdato eller periode', () => {
  it('skal vise en feilmelding dersom dato for brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const enkeltDatoKnapp = screen.getByRole('button', { name: 'Legg til enkeltdato' });
    await user.click(enkeltDatoKnapp);

    await trykkPåBekreftKnapp();
    const feilmelding = screen.getByText('Du må sette en dato');
    expect(feilmelding).toBeVisible();
  });

  it('skal være mulig å legge til flere rader med enkeltdato', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilEnkeltdatoKnapp = screen.getByRole('button', { name: 'Legg til enkeltdato' });
    await user.click(leggTilEnkeltdatoKnapp);
    await user.click(leggTilEnkeltdatoKnapp);
    const datoFelt = screen.getAllByRole('textbox', { name: 'dato' });
    expect(datoFelt.length).toEqual(2);
  });

  it('skal være mulig å slette en rad med enkeltdato', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilEnkeltdatoKnapp = screen.getByRole('button', { name: 'Legg til enkeltdato' });
    await user.click(leggTilEnkeltdatoKnapp);
    await user.click(leggTilEnkeltdatoKnapp);
    expect(screen.getAllByRole('textbox', { name: 'dato' }).length).toEqual(2);

    const slettKnapp = screen.getAllByRole('button', { name: 'Slett' });
    await user.click(slettKnapp[0]);
    expect(screen.getAllByRole('textbox', { name: 'dato' }).length).toEqual(1);
  });

  it('skal være mulig å legge til flere rader med perioder', async () => {
    await render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: 'Legg til periode' });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);
    const fraOgMedDatoFelt = screen.getAllByRole('textbox', { name: 'fra og med dato' });
    const tilOgMedDatoFelt = screen.getAllByRole('textbox', { name: 'til og med dato' });
    expect(fraOgMedDatoFelt.length).toEqual(2);
    expect(tilOgMedDatoFelt.length).toEqual(2);
  });

  it('skal være mulig å slette en rad med perioder', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: 'Legg til periode' });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);

    expect(screen.getAllByRole('textbox', { name: 'fra og med dato' }).length).toEqual(2);
    expect(screen.getAllByRole('textbox', { name: 'til og med dato' }).length).toEqual(2);

    const slettKnapp = screen.getAllByRole('button', { name: 'Slett' });
    await user.click(slettKnapp[0]);

    expect(screen.getAllByRole('textbox', { name: 'fra og med dato' }).length).toEqual(1);
    expect(screen.getAllByRole('textbox', { name: 'til og med dato' }).length).toEqual(1);
  });

  it('skal vise en feilmelding dersom det finnes overlappende perioder', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const group = screen.getByRole('group', {
      name: 'Velg grunn for bruddet',
    });

    const sykdomEllerskadeValg = within(group).getByText('Sykdom eller skade');
    await user.click(sykdomEllerskadeValg);

    const leggTilPeriodeKnapp = screen.getByRole('button', { name: 'Legg til periode' });
    await user.click(leggTilPeriodeKnapp);
    await user.click(leggTilPeriodeKnapp);

    const fraOgMedFelt = screen.getAllByRole('textbox', { name: 'fra og med dato' });
    const tilOgMedFelt = screen.getAllByRole('textbox', { name: 'til og med dato' });

    await user.type(fraOgMedFelt[0], '01.01.2020');
    await user.type(tilOgMedFelt[0], '01.02.2020');

    await user.type(fraOgMedFelt[1], '15.01.2020');
    await user.type(tilOgMedFelt[1], '24.02.2020');

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunnelse',
    });

    await user.type(begrunnelseFelt, 'Dette er en begrunnelse');
    await trykkPåBekreftKnapp();

    const feilmelding = screen.getByText('Det finnes overlappende perioder');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom det ikke er lagt til enkeltdato eller periode', async () => {
    render(<Aktivitetsplikt aktivitetspliktHendelser={[]} />);
    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const group = screen.getByRole('group', {
      name: 'Velg grunn for bruddet',
    });

    const sykdomEllerskadeValg = within(group).getByText('Sykdom eller skade');
    await user.click(sykdomEllerskadeValg);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /begrunnelse/i,
    });

    await user.type(begrunnelseFelt, 'Dette er en begrunnelse');
    await trykkPåBekreftKnapp();

    const feilmelding = screen.getByText('Du må legge til en enkeltdato eller periode');
    expect(feilmelding).toBeVisible();
  });
});

async function velgIkkeMøttITiltakSomBrudd() {
  const ikkeMøttilTiltakValg = screen.getByRole('radio', { name: 'Ikke møtt i tiltak' });
  await user.click(ikkeMøttilTiltakValg);
}

async function velgParagraf_11_8() {
  const paragraf_11_8Felt = screen.getByRole('radio', { name: '11-8 fravær fra fastsatt aktivitet' });
  await user.click(paragraf_11_8Felt);
}

async function trykkPåBekreftKnapp() {
  const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
  await user.click(bekreftKnapp);
}
