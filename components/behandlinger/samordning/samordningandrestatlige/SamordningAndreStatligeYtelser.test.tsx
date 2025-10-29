import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MellomlagretVurderingResponse, SamordningAndreStatligeYtelserGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { render, screen } from 'lib/test/CustomRender';
import { FetchResponse } from 'lib/utils/api';
import userEvent from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { SamordningAndreStatligeYtelser } from 'components/behandlinger/samordning/samordningandrestatlige/SamordningAndreStatligeYtelser';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagMedVurdering: SamordningAndreStatligeYtelserGrunnlag = {
  harTilgangTilÅSaksbehandle: false,
  vurdering: {
    begrunnelse: 'Dette er min vurdering som er bekreftet',
    vurderingPerioder: [],
    vurdertAv: { ident: 'Saksbehandler', dato: '2025-08-01' },
  },
};

const grunnlagUtenVurdering: SamordningAndreStatligeYtelserGrunnlag = { harTilgangTilÅSaksbehandle: false };

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_ANDRE_STATLIGE_YTELSER' });
});

it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });

  render(<SamordningAndreStatligeYtelser grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

  const endreKnapp = screen.getByRole('button', { name: 'Endre' });
  await user.click(endreKnapp);

  const begrunnelseFelt = screen.getByRole('textbox', {
    name: 'Vurder om brukeren har andre statlige ytelser som skal avregnes med AAP',
  });
  await user.clear(begrunnelseFelt);
  await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
  expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

  const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
  await user.click(avbrytKnapp);

  const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
    name: 'Vurder om brukeren har andre statlige ytelser som skal avregnes med AAP',
  });
  expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_SAMORDNING_ANDRE_STATLIGE_YTELSER,
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <SamordningAndreStatligeYtelser
        grunnlag={grunnlagUtenVurdering}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<SamordningAndreStatligeYtelser grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      }),
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
      <SamordningAndreStatligeYtelser
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
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
      <SamordningAndreStatligeYtelser
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<SamordningAndreStatligeYtelser behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningAndreStatligeYtelser
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      })
    ).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningAndreStatligeYtelser
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har andre statlige ytelser som kan gi fradrag fra AAP etterbetaling',
      })
    ).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SamordningAndreStatligeYtelser
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
