import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Oppfølging } from './Oppfølging';
import { format } from 'date-fns';

const user = userEvent.setup();

const søknadstidspunkt = format(new Date(), 'yyyy-MM-dd');

describe('Oppfølging', () => {
  it('Skal ha en overskrift', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    const heading = screen.getByText('§ 11-6 Behov for bistand til å skaffe seg eller beholde arbeid');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om bruker har behov for aktiv behandling', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    const felt = screen.getByRole('group', {
      name: 'a: Har bruker behov for aktiv behandling?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for om bruker har behov for arbeidsrettet tiltak', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    const felt = screen.getByRole('group', { name: 'b: Har bruker behov for arbeidsrettet tiltak?' });
    expect(felt).toBeVisible();
  });

  it('har felt for om bruker anses for å ha en viss mulighet til å komme i arbeid', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    expect(
      screen.queryByRole('group', {
        name: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
      })
    ).toBeVisible();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom a er besvart med ja', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom b er besvart med nei', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavB());
    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('skjuler felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom både a og b er besvart med ja', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    expect(finnGruppeForBokstavC()).toBeVisible();

    await velgJa(finnGruppeForBokstavA());
    await velgJa(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).not.toBeInTheDocument();
  });

  it('viser felt for om bruker anses for å ha en viss mulighet til å komme i arbeid dersom a og b er besvart med nei', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());

    expect(finnGruppeForBokstavC()).toBeVisible();
  });

  it('felt for når vurderingen gjelder fra vises ikke dersom det ikke er en revurdering', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling="Førstegangsbehandling"
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    expect(screen.queryByRole('textbox', { name: 'Vurderingen gjelder fra' })).not.toBeInTheDocument();
  });

  /* TODO skippes inntil backend er klar */
  it.skip('viser felt for når vurderingen gjelder fra dersom det er en revurdering', () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling="Revurdering"
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  /* TODO skippes inntil backend er klar */
  it.skip('felt for når vurderingen gjelder fra er påkrevd', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling="Revurdering"
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(screen.getByText('Du må velge når vurderingen gjelder fra')).toBeVisible();
  });

  /* TODO Skippes inntil backend er klar. Mangler å avgjøre hvordan steget skal vite om 11-5 er oppfylt eller ei */
  it.skip('viser spørsmål om bruker skal vurderes for AAP i overgang til uføre hvis det svares nei på a,b og c', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    expect(
      screen.getByRole('heading', { name: '§ 11-18 AAP under behandling av søknad om uføretrygd', level: 3 })
    ).toBeVisible();
    expect(
      screen.getByRole('group', {
        name: 'Har brukeren rett til AAP under behandling av søknad om uføretrygd etter § 11-18?',
      })
    ).toBeVisible();
  });

  /* TODO Skippes inntil backend er klar. Mangler å avgjøre hvordan steget skal vite om 11-5 er oppfylt eller ei */
  it.skip('viser spørsmål for om bruker skal vurderes for AAP i overgang til arbeid hvis det er en revurdering og det er avslag på både 11-5 og 11-6', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Revurdering'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );
    await velgNei(finnGruppeForBokstavA());
    await velgNei(finnGruppeForBokstavB());
    const gruppeC = screen.getByRole('group', {
      name: 'c: Kan bruker anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra Nav?',
    });
    await velgNei(gruppeC);
    expect(screen.getByRole('heading', { name: '§ 11-17 AAP i perioden som arbeidssøker', level: 3 })).toBeVisible();
    expect(
      screen.getByRole('group', { name: 'Har brukeren rett til AAP i perioden som arbeidssøker etter § 11-17?' })
    ).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må gi en begrunnelse om bruker har behov for oppfølging');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker har behov for aktiv behandling ikke er besvart', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await trykkPåBekreft();
    const feilmelding = screen.getByText('Du må svare på om bruker har behov for aktiv behandling');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker har behov for arbeidsrettet tiltak ikke er besvart', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

    await trykkPåBekreft();

    const feilmelding = screen.getByText('Du må svare på om bruker har behov for arbeidsrettet tiltak');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om bruker anses for å ha en viss mulighet for å komme i arbeid ikke er besvart', async () => {
    render(
      <Oppfølging
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        søknadstidspunkt={søknadstidspunkt}
      />
    );

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
