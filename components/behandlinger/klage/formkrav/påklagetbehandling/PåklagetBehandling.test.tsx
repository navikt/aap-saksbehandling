import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { PåklagetBehandling } from './PåklagetBehandling';
import { PåklagetBehandlingGrunnlag } from 'lib/types/types';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { userEvent } from '@testing-library/user-event';

const løsAvklaringsbehov = vi.fn();

vi.mock('hooks/saksbehandling/løsavklaringsbehov/useLøsAvklaringsbehov', () => ({
  useLøsAvklaringsbehov: () => ({
    løsAvklaringsbehovError: undefined,
    løsAvklaringsbehovStatus: undefined,
    løsAvklaringsbehovIsLoading: false,
    løsAvklaringsbehov: løsAvklaringsbehov,
  }),
}));

const user = userEvent.setup();

const grunnlag: PåklagetBehandlingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  behandlinger: [
    {
      referanse: 'uuid-1',
      opprettetTidspunkt: '2024-01-01T00:00:00Z',
      typeBehandling: 'Førstegangsbehandling',
      status: 'AVSLUTTET',
      vedtakstidspunkt: '2024-02-02T00:00:00Z',
      virkningstidspunkt: null,
      vurderingsbehov: ['FRITAK_MELDEPLIKT'],
      saksnummer: '1234',
    },
    {
      saksnummer: '1223',
      vurderingsbehov: ['MOTTATT_SØKNAD'],
      referanse: 'uuid-2',
      opprettetTidspunkt: '2024-01-01T00:00:00Z',
      typeBehandling: 'Førstegangsbehandling',
      status: 'AVSLUTTET',
      vedtakstidspunkt: '2024-02-02T00:00:00Z',
      virkningstidspunkt: null,
    },
  ],
  vedtatteKlagebehandlinger: [
    {
      saksnummer: '1234',
      vedtaksdato: '2025-01-01',
      referanse: 'uuid-klage',
    },
  ],
  tilbakekrevingsbehandlinger: [
    {
      saksnummer: '1200',
      opprettetTidspunkt: '2024-01-02T00:00:00Z',
      referanse: 'uuid-tilbake',
      status: 'AVSLUTTET',
      typeBehandling: 'Tilbakekreving',
      vedtaksdato: '2024-01-02',
      eksternSaksbehandlingUrl: 'http://ekstern-url',
    },
  ],
  vurderingerMeta: {},
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'PÅKLAGET_BEHANDLING' });
  løsAvklaringsbehov.mockReset();
});

describe('Klage', () => {
  it('Skal ha en overskrift', () => {
    render(<PåklagetBehandling grunnlag={undefined} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const heading = screen.getByText('Klage på vedtak');
    expect(heading).toBeVisible();
  });

  it('Skal ha 1 valg per behandling', () => {
    render(<PåklagetBehandling grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    const radios = screen.getAllByRole('radio');
    const radioValues = radios.map((r) => r.getAttribute('value'));

    expect(radios).toHaveLength(4);
    expect(radioValues).toContain('uuid-1');
    expect(radioValues).toContain('uuid-2');
    expect(radioValues).toContain('uuid-klage');
    expect(radioValues).toContain('uuid-tilbake');
  });

  it('Skal sende påklagetVedtakType=KELVIN_BEHANDLING når valgt behandling er en Kelvin-behandling', async () => {
    render(<PåklagetBehandling grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    await user.click(screen.getByDisplayValue('uuid-1'));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledOnce();
    const [avklaringsbehov] = løsAvklaringsbehov.mock.calls[0];
    expect(avklaringsbehov.behov.påklagetBehandlingVurdering).toEqual({
      påklagetVedtakType: 'KELVIN_BEHANDLING',
      påklagetBehandling: 'uuid-1',
    });
  });

  it('Skal sende påklagetVedtakType=TILBAKEKREVING når valgt behandling er en tilbakekrevingsbehandling', async () => {
    render(<PåklagetBehandling grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    await user.click(screen.getByDisplayValue('uuid-tilbake'));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledOnce();
    const [avklaringsbehov] = løsAvklaringsbehov.mock.calls[0];
    expect(avklaringsbehov.behov.påklagetBehandlingVurdering).toEqual({
      påklagetVedtakType: 'TILBAKEKREVING',
      påklagetBehandling: 'uuid-tilbake',
    });
  });

  it('Skal sende påklagetVedtakType=KELVIN_BEHANDLING når valgt behandling er en klagebehandling', async () => {
    render(<PåklagetBehandling grunnlag={grunnlag} readOnly={false} behandlingVersjon={0} typeBehandling={'Klage'} />);

    await user.click(screen.getByDisplayValue('uuid-klage'));
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(løsAvklaringsbehov).toHaveBeenCalledOnce();
    const [avklaringsbehov] = løsAvklaringsbehov.mock.calls[0];
    expect(avklaringsbehov.behov.påklagetBehandlingVurdering).toEqual({
      påklagetVedtakType: 'KELVIN_BEHANDLING',
      påklagetBehandling: 'uuid-klage',
    });
  });
});
