import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Oppfølging } from './Oppfølging';

describe('Oppfølging', () => {
  const user = userEvent.setup();

  it('Skal ha en overskrift', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('Behov for oppfølging § 11-6');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder om innbygger har behov for oppfølging' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha beskrivelse på felt for begrunnelse', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const beskrivelse = screen.getByText(
      'Beskriv oppfølgingsbehov, behovet for arbeidsrettet oppfølging og vurdering om det er en mulighet for å komme tilbake i arbeid og eventuell annen oppfølging fra nav'
    );
    expect(beskrivelse).toBeVisible();
  });

  it('Skal ha felt for om innbygger har behov for aktiv behandling', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', {
      name: 'Har innbygger behov for aktiv behandling?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for om innbygger har behov for arbeidsrettet tiltak', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', { name: 'Har innbygger behov for arbeidsrettet tiltak?' });
    expect(felt).toBeVisible();
  });

  it('Skal ikke vise felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom en av de foregående feltene er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.queryByRole('group', {
        name: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
      })
    ).not.toBeInTheDocument();

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'Har innbygger behov for aktiv behandling?',
    });

    const jaFeltHarInnbyggerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Ja',
    });

    await user.click(jaFeltHarInnbyggerBehovForAktivBehandling);

    const harInnbyggerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'Har innbygger behov for arbeidsrettet tiltak?',
    });
    const neiHarInnbyggerBehovForArbeidsrettetTiltakFelt = within(
      harInnbyggerBehovForArbeidsrettetTiltakFelt
    ).getByRole('radio', { name: 'Nei' });

    await user.click(neiHarInnbyggerBehovForArbeidsrettetTiltakFelt);

    expect(
      screen.queryByRole('group', {
        name: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
      })
    ).not.toBeInTheDocument();
  });

  it('Skal vise felt for om innbygger anses for å ha en viss mulighet til å komme i arbeid dersom begge foregående feltene er besvart med nei', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.queryByRole('group', {
        name: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
      })
    ).not.toBeInTheDocument();

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'Har innbygger behov for aktiv behandling?',
    });

    const neiFeltHarInnbyggerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Nei',
    });

    await user.click(neiFeltHarInnbyggerBehovForAktivBehandling);

    const harInnbyggerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'Har innbygger behov for arbeidsrettet tiltak?',
    });
    const neiHarInnbyggerBehovForArbeidsrettetTiltakFelt = within(
      harInnbyggerBehovForArbeidsrettetTiltakFelt
    ).getByRole('radio', { name: 'Nei' });

    await user.click(neiHarInnbyggerBehovForArbeidsrettetTiltakFelt);

    expect(
      await screen.findByRole('group', {
        name: 'Kan innbygger anses for å ha en viss mulighet for å komme i arbeid, ved å få annen oppfølging fra NAV?',
      })
    ).toBeInTheDocument();
  });

  it('Skal ha synlig vilkårsveiledning for feltet har innbygger behov for arbeidsrettet tiltak', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const vilkårsveiledningTekst = screen.getByText('Med et arbeidsrettet tiltak etter folketrygdloven § 11-6 menes');
    expect(vilkårsveiledningTekst).toBeVisible();
  });

  it('Skal ha synlig vilkårsveiledning for feltet har innbygger behov for aktiv behandling', () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);
    const vilkårsveiledningTekst = screen.getByText(
      /med aktiv behandling menes behandling som behandlende lege anbefaler medlemmet å gjennomføre med mål om å bedre arbeidsevnen\. behandling kan gis av for eksempel lege, psykolog, fysioterapeut, kiropraktorer, manuell terapeut mv\. det er en forutsetning at behandlingen er et ledd i en medisinsk behandlingsplan for å bedre arbeidsevnen\./i
    );
    expect(vilkårsveiledningTekst).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet for begrunnelse ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må gi en begrunnelse om innbygger har behov for oppfølging');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger har behov for aktiv behandling ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må svare på om innbygger har behov for aktiv behandling');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger har behov for arbeidsrettet tiltak ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må svare på om innbygger har behov for arbeidsrettet tiltak');
    expect(feilmelding).toBeVisible();
  });

  it('Skal vise feilmelding dersom feltet om innbygger anses for å ha en viss mulighet for å komme i arbeid ikke er besvart', async () => {
    render(<Oppfølging readOnly={false} behandlingVersjon={0} />);

    const harInnbyggetBehovForAktivBehandling = screen.getByRole('group', {
      name: 'Har innbygger behov for aktiv behandling?',
    });

    const neiFeltHarInnbyggerBehovForAktivBehandling = within(harInnbyggetBehovForAktivBehandling).getByRole('radio', {
      name: 'Nei',
    });

    await user.click(neiFeltHarInnbyggerBehovForAktivBehandling);

    const harInnbyggerBehovForArbeidsrettetTiltakFelt = screen.getByRole('group', {
      name: 'Har innbygger behov for arbeidsrettet tiltak?',
    });
    const neiHarInnbyggerBehovForArbeidsrettetTiltakFelt = within(
      harInnbyggerBehovForArbeidsrettetTiltakFelt
    ).getByRole('radio', { name: 'Nei' });

    await user.click(neiHarInnbyggerBehovForArbeidsrettetTiltakFelt);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText(
      'Du må svare på om innbygger anses for å ha en viss mulighet til å komme i arbeid'
    );
    expect(feilmelding).toBeVisible();
  });
});
