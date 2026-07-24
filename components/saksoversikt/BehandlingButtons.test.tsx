import { render, screen } from 'lib/test/CustomRender';
import { OppgavePåBehandling } from 'lib/types/oppgaveTypes';
import { describe, expect, it, vi } from 'vitest';

import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';
import { lagBehandling, lagSak } from 'components/saksoversikt/SakMedBehandlinger.test';
import { BehandlingsflytEllerPostmottakBehandling } from 'components/saksoversikt/types';

describe('BehandlingButtons', () => {
  it('skal kun vise behandle-knapp når oppgave er reservert til innlogget bruker', () => {
    const sak = lagSak([lagBehandling({ status: 'OPPRETTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    const oppgavePåBehandling: OppgavePåBehandling = {
      id: 123,
      versjon: 1,
      behandlingsreferanse: '123',
      reservertAvIdent: 'Z000000',
      reservertAvNavn: 'Saksbehandler Saksbehandlersen',
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        oppgavePåBehandling={oppgavePåBehandling}
      />
    );

    const behandleknapp = screen.getByText('Behandle');
    expect(behandleknapp).toBeInTheDocument();
  });

  it('skal kun vise åpne-knapp når oppgave er reservert til noen andre', () => {
    const sak = lagSak([lagBehandling({ status: 'OPPRETTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    const oppgavePåBehandling: OppgavePåBehandling = {
      id: 123,
      versjon: 1,
      behandlingsreferanse: '123',
      reservertAvIdent: 'z456',
      reservertAvNavn: 'Saksbehandler Saksbehandlersen',
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        oppgavePåBehandling={oppgavePåBehandling}
      />
    );

    const behandleknapp = screen.queryByText('Behandle');
    expect(behandleknapp).not.toBeInTheDocument();

    const åpneknapp = screen.getByText('Åpne');
    expect(åpneknapp).toBeInTheDocument();
  });

  it('skal vise både åpne-knapp og behandle-knapp når behandling er ledig', () => {
    const sak = lagSak([lagBehandling({ status: 'OPPRETTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    const oppgavePåBehandling: OppgavePåBehandling = {
      id: 123,
      versjon: 1,
      behandlingsreferanse: '123',
      reservertAvIdent: null,
      reservertAvNavn: null,
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        oppgavePåBehandling={oppgavePåBehandling}
      />
    );

    const behandleknapp = screen.getByText('Behandle');
    expect(behandleknapp).toBeInTheDocument();

    const åpneknapp = screen.getByText('Åpne');
    expect(åpneknapp).toBeInTheDocument();
  });

  it('skal bare vise vis-knapp når behandling er avsluttet', () => {
    const sak = lagSak([lagBehandling({ status: 'AVSLUTTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    render(
      <BehandlingButtons sak={sak} behandling={behandling} setFeilmelding={vi.fn()} oppgavePåBehandling={undefined} />
    );
    const behandleknapp = screen.queryByText('Behandle');
    expect(behandleknapp).not.toBeInTheDocument();

    const åpneknapp = screen.queryByText('Åpne');
    expect(åpneknapp).not.toBeInTheDocument();

    const visknapp = screen.getByText('Vis');
    expect(visknapp).toBeInTheDocument();
  });

  it('ikke vis behandle-knapp når henting av oppgave feilet', () => {
    const sak = lagSak([lagBehandling({ status: 'UTREDES', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        oppgavePåBehandling={undefined}
      />
    );
    const behandleknapp = screen.queryByText('Behandle');
    expect(behandleknapp).not.toBeInTheDocument();

    const åpneknapp = screen.getByText('Åpne');
    expect(åpneknapp).toBeInTheDocument();
  });
});
