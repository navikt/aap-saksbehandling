import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Oppfølging } from './Oppfølging';

const user = userEvent.setup();
describe('Oppfølging', () => {
  it('Skal ha en overskrift', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('Behov for oppfølging § 11-6');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder om innbygger har behov for oppfølging' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha beskrivelse på felt for begrunnelse', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const beskrivelse = screen.getByText(
      'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav'
    );
    expect(beskrivelse).toBeVisible();
  });

  it('Skal ha felt for om innbygger har behov for aktiv behandling', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'a: Har innbygger behov for aktiv behandling?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for om innbygger har behov for arbeidsrettet tiltak', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', { name: 'b: Har innbygger behov for arbeidsrettet tiltak?' });
    expect(felt).toBeVisible();
  });

  it('har felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    expect(
      screen.queryByRole('group', {
        name: 'c: Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
      })
    ).toBeVisible();
  });

  it('skjuler felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom a er besvart med ja', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom b er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavB());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom både a og b er besvart med ja', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    await velgJa(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('viser felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom a og b er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse om innbygger har behov for oppfølging');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger har behov for aktiv behandling ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må svare på om innbygger har behov for aktiv behandling');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger har behov for arbeidsrettet tiltak ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om innbygger har behov for arbeidsrettet tiltak');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger anses for å ha en viss mulighet for å komme i arbeid ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'a: Har innbygger behov for aktiv behandling?',
    });

    const neiFeltHarInnbyggerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Nei',
    });

    await user.click(neiFeltHarInnbyggerBehovForAktivBehandling);

    const harInnbyggerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'b: Har innbygger behov for arbeidsrettet tiltak?',
    });
    const neiHarInnbyggerBehovForArbeidsrettetTiltakFelt = within(
      harInnbyggerBehovForArbeidsrettetTiltakFelt
    ).getByRole('radio', { name: 'Nei' });

    await user.click(neiHarInnbyggerBehovForArbeidsrettetTiltakFelt);

    await trykkPåBekreft();
    const feilmelding = screen.getByText(
      'Du må svare på om innbygger anses for å ha en viss mulighet til å komme i arbeid'
    );
    expect(feilmelding).toBeVisible();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
const finnGruppeForBokstavA = () => screen.getByRole('group', { name: 'a: Har innbygger behov for aktiv behandling?' });
const finnGruppeForBokstavB = () =>
  screen.getByRole('group', { name: 'b: Har innbygger behov for arbeidsrettet tiltak?' });
const finnGruppeForBokstavC = () =>
  screen.queryByRole('group', {
    name: 'c: Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
  });

const velgJa = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Ja' }));
};

const velgNei = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Nei' }));
};
