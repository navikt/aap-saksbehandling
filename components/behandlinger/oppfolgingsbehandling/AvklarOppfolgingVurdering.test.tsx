import createFetchMock from 'vitest-fetch-mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AvklarOppfolgingsoppgaveGrunnlagResponse, MellomlagretVurderingResponse } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { render, screen } from 'lib/test/CustomRender';
import { FetchResponse } from 'lib/utils/api';
import { AvklaroppfolgingVurdering } from 'components/behandlinger/oppfolgingsbehandling/AvklarOppfolgingVurdering';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_OPPFØLGING' });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_OPPFØLGINGSBEHOV_NAY,
      behandlingId: { id: 1 },
      data: '{"årsak":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: AvklarOppfolgingsoppgaveGrunnlagResponse = {
    datoForOppfølging: '2025-09-03',
    hvaSkalFølgesOpp: 'Masse greier',
    hvemSkalFølgeOpp: 'NasjonalEnhet',
    grunnlag: {
      årsak: 'Dette er min vurdering som er bekreftet',
      konsekvensAvOppfølging: 'OPPRETT_VURDERINGSBEHOV',
      opplysningerTilRevurdering: [],
      vurdertAv: '',
    },
  };

  const grunnlagUtenVurdering: AvklarOppfolgingsoppgaveGrunnlagResponse = {
    datoForOppfølging: '2025-09-03',
    hvaSkalFølgesOpp: 'Masse greier',
    hvemSkalFølgeOpp: 'NasjonalEnhet',
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <AvklaroppfolgingVurdering
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<AvklaroppfolgingVurdering grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);
    await user.type(
      screen.getByRole('textbox', { name: 'Hva er årsaken?' }),
      'Her har jeg begynt å skrive en vurdering..'
    );
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
      <AvklaroppfolgingVurdering
        grunnlag={grunnlagUtenVurdering}
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
      <AvklaroppfolgingVurdering
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Hva er årsaken?',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<AvklaroppfolgingVurdering behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Hva er årsaken?',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <AvklaroppfolgingVurdering
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Hva er årsaken?' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Hva er årsaken?' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Hva er årsaken?' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <AvklaroppfolgingVurdering
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Hva er årsaken?' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Hva er årsaken?' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Hva er årsaken?' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <AvklaroppfolgingVurdering
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
