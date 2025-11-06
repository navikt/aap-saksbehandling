import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { SvarFraAndreinstans } from 'components/behandlinger/svarfraandreinstans/SvarFraAndreinstans';
import { MellomlagretVurderingResponse, SvarFraAndreinstansGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SVAR_FRA_ANDREINSTANS' });
});

describe('Svar fra andreinstans', () => {
  it('Skal ha en overskrift', () => {
    render(<SvarFraAndreinstans readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('Vurder konsekvens av svar fra Nav Klageinstans');
    expect(heading).toBeVisible();
  });

  it('Skal vise type svar og begrunnelse for feilregistrering', () => {
    render(
      <SvarFraAndreinstans
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{
          svarFraAndreinstans: {
            type: 'BEHANDLING_FEILREGISTRERT',
            utfall: null,
            feilregistrertBegrunnelse: 'Dette er en begrunnelse for feilregistrering.',
          },
          harTilgangTilÅSaksbehandle: true,
        }}
      />
    );
    const type = screen.getByText('Behandling feilregistrert');
    const begrunnelse = screen.getByText('Dette er en begrunnelse for feilregistrering.');
    expect(type).toBeVisible();
    expect(begrunnelse).toBeVisible();
  });

  it('Skal vise type svar og utfall for klagebehandling', () => {
    render(
      <SvarFraAndreinstans
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={{
          svarFraAndreinstans: {
            type: 'KLAGEBEHANDLING_AVSLUTTET',
            utfall: 'AVVIST',
          },
          harTilgangTilÅSaksbehandle: true,
        }}
      />
    );
    const type = screen.getByText('Klagebehandling avsluttet');
    const utfall = screen.getByText('Avvist');
    expect(type).toBeVisible();
    expect(utfall).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.HÅNDTER_SVAR_FRA_ANDREINSTANS,
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: SvarFraAndreinstansGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    gjeldendeVurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      konsekvens: 'OMGJØRING',
      vilkårSomOmgjøres: [],
      vurdertAv: '',
    },
    svarFraAndreinstans: {
      avsluttetTidspunkt: undefined,
      feilregistrertBegrunnelse: undefined,
      opprettetTidspunkt: undefined,
      type: 'BEHANDLING_FEILREGISTRERT',
      utfall: undefined,
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <SvarFraAndreinstans
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<SvarFraAndreinstans behandlingVersjon={0} readOnly={false} />);
    await user.type(screen.getByRole('textbox', { name: 'Kommentar' }), 'Her har jeg begynt å skrive en vurdering..');
    expect(screen.queryByText('Utkast lagret 21.08.2025 00:00 (Jan T. Loven)')).not.toBeInTheDocument();

    const mockFetchResponseLagreMellomlagring: FetchResponse<MellomlagretVurderingResponse> = {
      type: 'SUCCESS',
      data: mellomlagring,
      status: 200,
    };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseLagreMellomlagring));

    const lagreKnapp = screen.getByRole('button', { name: 'Lagre utkast' });
    await user.click(lagreKnapp);
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <SvarFraAndreinstans
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).toBeVisible();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.queryByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)')).not.toBeInTheDocument();
  });

  it('Skal bruke mellomlagring som defaultValue i skjema dersom det finnes', () => {
    render(
      <SvarFraAndreinstans
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Kommentar',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<SvarFraAndreinstans behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Kommentar',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SvarFraAndreinstans
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Kommentar' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Kommentar' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Kommentar' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SvarFraAndreinstans
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Kommentar' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Kommentar' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Kommentar' })).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SvarFraAndreinstans
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});
