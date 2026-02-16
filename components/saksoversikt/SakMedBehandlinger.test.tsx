import { describe, expect, it } from 'vitest';
import { SakMedBehandlinger } from './SakMedBehandlinger';
import { render, screen, within } from 'lib/test/CustomRender';
import { SaksInfo, BehandlingInfo } from 'lib/types/types';

const lagBehandling = (overrides: Partial<BehandlingInfo> & Pick<BehandlingInfo, 'status' | 'referanse'>): BehandlingInfo =>
  ({
    opprettet: '2026-01-01T12:00:00',
    typeBehandling: 'Førstegangsbehandling',
    vurderingsbehov: [],
    årsakTilOpprettelse: 'SØKNAD',
    ...overrides,
  }) as BehandlingInfo;

const lagSak = (behandlinger: BehandlingInfo[]): SaksInfo =>
  ({
    saksnummer: '12345',
    ident: '12345678910',
    opprettetTidspunkt: '2026-01-01T00:00:00',
    periode: { fom: '2026-01-01', tom: '2026-12-31' },
    status: 'UTREDES',
    behandlinger,
  }) as SaksInfo;

describe('SakMedBehandlinger', () => {
  it('viser åpne behandlinger før avsluttede', () => {
    const sak = lagSak([
      lagBehandling({ status: 'AVSLUTTET', referanse: 'avsluttet-1', opprettet: '2026-01-01T10:00:00' }),
      lagBehandling({ status: 'OPPRETTET', referanse: 'åpen-1', opprettet: '2026-01-02T10:00:00' }),
      lagBehandling({ status: 'IVERKSETTES', referanse: 'avsluttet-2', opprettet: '2026-01-03T10:00:00' }),
      lagBehandling({ status: 'UTREDES', referanse: 'åpen-2', opprettet: '2026-01-04T10:00:00' }),
    ]);

    render(<SakMedBehandlinger sak={sak} />);

    const rows = screen.getAllByRole('row');
    // Første rad er header, resten er behandlinger
    const dataRows = rows.slice(1);

    expect(dataRows).toHaveLength(4);

    // Åpne behandlinger (OPPRETTET, UTREDES) skal komme først
    expect(within(dataRows[0]).getByText('Opprettet')).toBeInTheDocument();
    expect(within(dataRows[1]).getByText('Utredes')).toBeInTheDocument();

    // Avsluttede behandlinger (AVSLUTTET, IVERKSETTES) skal komme sist
    expect(within(dataRows[2]).getByText('Avsluttet')).toBeInTheDocument();
    expect(within(dataRows[3]).getByText('Iverksettes')).toBeInTheDocument();
  });
});
