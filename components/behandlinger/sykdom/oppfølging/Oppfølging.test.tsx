import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Oppfølging } from './Oppfølging';

const user = userEvent.setup();
describe('Oppfølging', () => {
  it('Skal ha en overskrift', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om bruker har behov for aktiv behandling', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'a: Har bruker behov for aktiv behandling?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for om bruker har behov for arbeidsrettet tiltak', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', { name: 'b: Har bruker behov for arbeidsrettet tiltak?' });
    expect(felt).toBeVisible();
  });

  it('har felt for om bruker anses for å ha en viss mulighet til å komme i arbeid', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    expect(
      screen.queryByRole('group', {
        name: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
      })
    ).toBeVisible();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom a er besvart med ja', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom b er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavB());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom både a og b er besvart med ja', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    await velgJa(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('viser felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom a og b er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse om bruker har behov for oppfølging');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker har behov for aktiv behandling ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må svare på om bruker har behov for aktiv behandling');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker har behov for arbeidsrettet tiltak ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om bruker har behov for arbeidsrettet tiltak');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker anses for å ha en viss mulighet for å komme i arbeid ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'a: Har bruker behov for aktiv behandling?',
    });

    const neiFeltHarBrukerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Nei',
    });

    await user.click(neiFeltHarBrukerBehovForAktivBehandling);

    const harBrukerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'b: Har bruker behov for arbeidsrettet tiltak?',
    });
    const neiHarBrukerBehovForArbeidsrettetTiltakFelt = within(harBrukerBehovForArbeidsrettetTiltakFelt).getByRole(
      'radio',
      { name: 'Nei' }
    );

    await user.click(neiHarBrukerBehovForArbeidsrettetTiltakFelt);

    await trykkPåBekreft();
    const feilmelding = screen.getByText(
      'Du må svare på om bruker anses for å ha en viss mulighet til å komme i arbeid'
    );
    expect(feilmelding).toBeVisible();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
const finnGruppeForBokstavA = () => screen.getByRole('group', { name: 'a: Har bruker behov for aktiv behandling?' });
const finnGruppeForBokstavB = () =>
  screen.getByRole('group', { name: 'b: Har bruker behov for arbeidsrettet tiltak?' });
const finnGruppeForBokstavC = () =>
  screen.queryByRole('group', {
    name: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
  });

const velgJa = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Ja' }));
};

const velgNei = async (group: HTMLElement) => {
  await user.click(within(group).getByRole('radio', { name: 'Nei' }));
};
