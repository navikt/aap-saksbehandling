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
  avsluttaTilbakekrevingsbehandlinger: [
    {
      saksnummer: '1200',
      opprettetTidspunkt: '2024-01-02T00:00:00Z',
      referanse: 'uuid-tilbake',
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

  it('Skal vise tilbakekrevingsrad med vedtaksdato basert på vedtaksdato-verdi over oprettetTidspunkt når begge er tilstede i grunnlag', async () => {
    const grunnlagUtenVedtaksdato: PåklagetBehandlingGrunnlag = {
      ...grunnlag,
      avsluttaTilbakekrevingsbehandlinger: [
        {
          saksnummer: '1200',
          opprettetTidspunkt: '2026-09-10T00:00:00Z',
          referanse: 'uuid-tilbake-med-vedtaksdato',
          typeBehandling: 'Tilbakekreving',
          vedtaksdato: '2026-09-20',
          eksternSaksbehandlingUrl: 'http://ekstern-url',
        },
      ],
    };

    render(
      <PåklagetBehandling
        grunnlag={grunnlagUtenVedtaksdato}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    expect(screen.getByDisplayValue('uuid-tilbake-med-vedtaksdato')).toBeVisible();
    expect(screen.getByText('20.09.2026')).toBeVisible();
  });

  it('Skal vise tilbakekrevingsrad med vedtaksdato falt tilbake til opprettetTidspunkt når vedtaksdato mangler', async () => {
    const grunnlagUtenVedtaksdato: PåklagetBehandlingGrunnlag = {
      ...grunnlag,
      avsluttaTilbakekrevingsbehandlinger: [
        {
          saksnummer: '1200',
          opprettetTidspunkt: '2024-01-02T00:00:00Z',
          referanse: 'uuid-tilbake-uten-vedtaksdato',
          typeBehandling: 'Tilbakekreving',
          vedtaksdato: null,
          eksternSaksbehandlingUrl: 'http://ekstern-url',
        },
      ],
    };

    render(
      <PåklagetBehandling
        grunnlag={grunnlagUtenVedtaksdato}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
      />
    );

    expect(screen.getByDisplayValue('uuid-tilbake-uten-vedtaksdato')).toBeVisible();
    expect(screen.getByText('02.01.2024')).toBeVisible();
  });

  it('Skal vise valideringsfeil i stedet for å kaste når mellomlagret vedtak ikke finnes i grunnlaget', async () => {
    render(
      <PåklagetBehandling
        grunnlag={grunnlag}
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Klage'}
        initialMellomlagretVurdering={{
          avklaringsbehovkode: '5001',
          behandlingId: { id: 0 },
          data: JSON.stringify({ vedtak: 'uuid-finnes-ikke' }),
          vurdertAv: 'Z999999',
          vurdertDato: '2025-04-01T12:30:00',
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(await screen.findByText('Valgt vedtak finnes ikke lenger. Velg på nytt.')).toBeVisible();
    expect(løsAvklaringsbehov).not.toHaveBeenCalled();
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
