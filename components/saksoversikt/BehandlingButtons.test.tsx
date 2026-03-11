import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { BehandlingButtons } from 'components/saksoversikt/BehandlingButtons';
import { lagBehandling, lagSak } from 'components/saksoversikt/SakMedBehandlinger.test';
import { BehandlingsflytEllerPostmottakBehandling } from 'components/saksoversikt/types';
import { OppgaveInfo } from 'hooks/oppgave/OppgaverPåSakHook';

describe('BehandlingButtons', () => {
  it('skal kun vise behandle-knapp når oppgave er reservert til innlogget bruker', () => {
    const sak = lagSak([lagBehandling({ status: 'OPPRETTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' })]);

    const behandling: BehandlingsflytEllerPostmottakBehandling = {
      behandling: sak.behandlinger[0],
      kilde: 'BEHANDLINGSFLYT',
    };

    const oppgaveInfo: OppgaveInfo = {
      id: 123,
      versjon: 1,
      reservertAvIdent: 'z123',
      reservertAvNavn: 'Saksbehandler Saksbehandlersen',
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        innloggetBrukerIdent={'z123'}
        oppgaveInfo={oppgaveInfo}
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

    const oppgaveInfo: OppgaveInfo = {
      id: 123,
      versjon: 1,
      reservertAvIdent: 'z456',
      reservertAvNavn: 'Saksbehandler Saksbehandlersen',
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        innloggetBrukerIdent={'z123'}
        oppgaveInfo={oppgaveInfo}
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

    const oppgaveInfo: OppgaveInfo = {
      id: 123,
      versjon: 1,
      reservertAvIdent: null,
      reservertAvNavn: null,
    };

    render(
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        innloggetBrukerIdent={'z123'}
        oppgaveInfo={oppgaveInfo}
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
      <BehandlingButtons
        sak={sak}
        behandling={behandling}
        setFeilmelding={vi.fn()}
        innloggetBrukerIdent={'z123'}
        oppgaveInfo={undefined}
      />
    );

    const behandleknapp = screen.queryByText('Behandle');
    expect(behandleknapp).not.toBeInTheDocument();

    const åpneknapp = screen.queryByText('Åpne');
    expect(åpneknapp).not.toBeInTheDocument();

    const visknapp = screen.getByText('Vis');
    expect(visknapp).toBeInTheDocument();
  });
});
