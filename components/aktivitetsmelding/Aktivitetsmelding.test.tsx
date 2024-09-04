import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AktivitetsMelding } from 'components/aktivitetsmelding/AktivitetsMelding';
import { Aktivitetsmeldinger } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';

const aktivitetsMelding: Aktivitetsmeldinger = {
  hammere: [],
};

describe('aktivitetsmelding', () => {
  const user = userEvent.setup();

  it('skal ha en tabell for tidligere brudd på aktivitetsplikten', () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    const overskriftTabell = screen.getByText('Tidligere brudd på aktivitetsplikten');
    expect(overskriftTabell).toBeVisible();
  });

  it('skal ha et felt for å registrere brudd på aktivitetsplikten', () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    const felt = screen.getByRole('group', { name: /registrer brudd på aktivitetsplikt/i });
    expect(felt).toBeVisible();
  });

  it('skal ha alle valgene i feltet for å registrere brudd på aktivitetsplikten', () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
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
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragrafFelt = screen.getByRole('group', { name: /velg paragraf/i });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en paragraf dersom man velger ikke møtt i behandling/utredning', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    const ikkeMøttIBehandlingValg = screen.getByRole('radio', { name: /ikke møtt i behandling\/ utredning/i });
    await user.click(ikkeMøttIBehandlingValg);

    const paragrafFelt = screen.getByRole('group', { name: /velg paragraf/i });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal dukke opp et felt for å velge en paragraf dersom man velger at bruker ikke har sendt inn dokumentasjon', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    const ikkeSendtInnDokumentasjonFelt = screen.getByRole('radio', {
      name: /bruker har ikke sendt inn dokumentasjon som nav har bedt om på aktivitet/i,
    });
    await user.click(ikkeSendtInnDokumentasjonFelt);

    const paragrafFelt = screen.getByRole('group', { name: /velg paragraf/i });
    expect(paragrafFelt).toBeVisible();
  });

  it('skal ha alle valgene i feltet for hvilken paragraf', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    await velgIkkeMøttITiltakSomBrudd();

    const paragraf_11_8Felt = screen.getByRole('radio', { name: /11-8 fravær fra fastsatt aktivitet/i });
    expect(paragraf_11_8Felt).toBeVisible();

    const paragraf_11_9Felt = screen.getByRole('radio', {
      name: /11-9 reduksjon av aap ved brudd på nærmere bestemte aktivitetsplikter/i,
    });
    expect(paragraf_11_9Felt).toBeVisible();
  });

  it.skip('skal dukke opp et dato felt for brudd på aktivitetsplikt dersom man velger en paragraf', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    await velgIkkeMøttITiltakSomBrudd();

    await velgParagraf_11_8();

    const felt = screen.getByRole('textbox', { name: /dato for ikke møtt til tiltak/i });
    expect(felt).toBeVisible();
  });

  it('skal dukke opp et begrunnelsesfelt for brudd på aktivitetsplikt dersom man velger en paragraf', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    await velgIkkeMøttITiltakSomBrudd();

    await velgParagraf_11_8();

    const felt = screen.getByRole('textbox', { name: /begrunnelse/i });
    expect(felt).toBeVisible();
  });

  it('skal dukke opp et felt for å sende forhåndsvarsel for brudd på aktivitetsplikt dersom man velger en paragraf', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);
    await velgIkkeMøttITiltakSomBrudd();

    await velgParagraf_11_8();

    const felt = screen.getByRole('checkbox', { name: /send forhåndsvarsel/i });
    expect(felt).toBeVisible();
  });

  it('skal vise en feilmelding dersom brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må registrere et brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom hvilken paragraf det gjelder ikke er besvart', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);

    await velgIkkeMøttITiltakSomBrudd();
    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må velge en paragraf');
    expect(feilmelding).toBeVisible();
  });

  it.skip('skal vise en feilmelding dersom dato for brudd på aktivitetsplikten ikke er besvart', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må sette en dato for brudd på aktivitetsplikten');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise en feilmelding dersom begrunnelse ikke er besvart', async () => {
    render(<AktivitetsMelding saksnummer={'1233'} aktivitetsMeldinger={aktivitetsMelding} />);

    await velgIkkeMøttITiltakSomBrudd();
    await velgParagraf_11_8();

    const bekreftKnapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(bekreftKnapp);
    const feilmelding = screen.getByText('Du må skrive en begrunnelse for brudd på aktivitetsplikten');
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
