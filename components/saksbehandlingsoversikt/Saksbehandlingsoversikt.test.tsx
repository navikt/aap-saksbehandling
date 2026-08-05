import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Saksbehandlingsoversikt } from 'components/saksbehandlingsoversikt/Saksbehandlingsoversikt';
import { DetaljertBehandling, SaksInfo } from 'lib/types/types';
import { customRender } from 'lib/test/CustomRender';

const mockBehandling: DetaljertBehandling = {
  status: 'UTREDES',
  type: 'Førstegangsbehandling',
  aktivtSteg: 'SØKNAD',
  avklaringsbehov: [],
  opprettet: '12.12.2024',
  referanse: '1234',
  skalForberede: false,
  versjon: 1,
  vilkår: [],
  virkningstidspunkt: '2025-02-11',
  vurderingsbehovOgÅrsaker: [],
};

const mockSak: SaksInfo = {
  behandlinger: [],
  ident: '12345678901',
  periode: { fom: '2025-01-31', tom: '2026-01-31' },
  status: 'UTREDES',
  saksnummer: 'ERT2E',
  opprettetTidspunkt: '2025-04-25T07:44:27.789298',
};

const mockKabalKlageresultat = {
  type: 'ERROR' as const,
  status: 500,
  apiException: { message: 'Kunne ikke hente klageresultat' },
};

describe('Saksbehandlingsoversikt', () => {
  beforeEach(() =>
    customRender(
      <Saksbehandlingsoversikt
        behandling={mockBehandling}
        sak={mockSak}
        kabalKlageresultat={mockKabalKlageresultat}
        expanded={true}
        onExpandedChange={vi.fn()}
      />
    )
  );
  it('har en overskrift som viser behandlingstype', () => {
    expect(screen.getByText('Førstegangsbehandling')).toBeVisible();
  });

  it('har en knapp for å minimere komponenten', () => {
    expect(screen.getByRole('button', { name: 'Skjul kolonne' })).toBeVisible();
  });
});
