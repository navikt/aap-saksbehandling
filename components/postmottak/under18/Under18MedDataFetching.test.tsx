import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { hentFlyt, hentUnder18Grunnlag } from 'lib/services/postmottakservice/postmottakservice';
import { BehandlingFlytOgTilstand, Under18Grunnlag } from 'lib/types/postmottakTypes';
import { PostmottakFlytResponse, setPostmottakMockFlytResponse } from 'vitestSetup';
import { Under18MedDataFetching } from './Under18MedDataFetching';

vi.mock('lib/services/postmottakservice/postmottakservice', () => ({
  hentFlyt: vi.fn(),
  hentUnder18Grunnlag: vi.fn(),
}));

const grunnlag: Under18Grunnlag = {
  behandling: {
    aktivtSteg: 'AVKLAR_UNDER18_SAMTYKKE',
    status: 'UTREDES',
    referanse: '456',
    versjon: 4,
    åpneBehov: [],
    vent: [],
    prosesseringFeilet: false,
  },
  aldersgrunnlag: { aldersgruppe: 'SAMTYKKE', fødselsdato: '2009-01-01' },
  samtykkevurdering: { beggeForeldreSamtykket: true, samtykkeJournalpostIder: [] },
  søknader: [],
};
const under18Flyt: BehandlingFlytOgTilstand['flyt'] = [
  {
    stegGruppe: 'UNDER18',
    erFullført: false,
    skalVises: true,
    steg: [
      { stegType: 'AVKLAR_UNDER18', avklaringsbehov: [] },
      { stegType: 'AVKLAR_UNDER18_SAMTYKKE', avklaringsbehov: [] },
    ],
  },
];

beforeEach(() => {
  vi.mocked(hentUnder18Grunnlag).mockResolvedValue({ type: 'SUCCESS', status: 200, data: grunnlag });
});

it.each([false, true])('viser skjemaet med flytens readOnly=%s', async (readOnly) => {
  const flyt = {
    ...PostmottakFlytResponse,
    flyt: under18Flyt,
    aktivGruppe: 'UNDER18' as const,
    aktivtSteg: 'AVKLAR_UNDER18_SAMTYKKE' as const,
    behandlingVersjon: 4,
    visning: { ...PostmottakFlytResponse.visning, typeBehandling: 'Under18' as const, readOnly },
  };
  setPostmottakMockFlytResponse(flyt);
  vi.mocked(hentFlyt).mockResolvedValue({ type: 'SUCCESS', status: 200, data: flyt });

  render(await Under18MedDataFetching({ behandlingsreferanse: '456' }));

  expect(
    screen.getByRole('radiogroup', { name: /Er samtykket vedlagt og signert av foreldre med foreldreansvar/ })
  ).toBeVisible();
  expect(screen.getByText('01.01.2009')).toBeVisible();
  const søknad = screen.getByRole('region', { name: 'Avklar søknaden' });
  const samtykke = screen.getByRole('region', { name: 'Avklar samtykke' });
  expect(within(søknad).getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).toBeVisible();
  expect(
    within(samtykke).queryByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })
  ).not.toBeInTheDocument();
  if (readOnly) {
    expect(screen.queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
  } else {
    expect(within(samtykke).getByRole('button', { name: 'Lagre svar' })).toBeVisible();
    expect(within(søknad).getByRole('button', { name: 'Endre' })).toBeVisible();
    expect(within(søknad).queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(within(søknad).getByRole('button', { name: 'Endre' }));
    await user.click(
      within(within(søknad).getByRole('radiogroup', { name: /Er brukeren over 17 år og 9 måneder/ })).getByRole(
        'radio',
        { name: 'Nei' }
      )
    );
    expect(within(søknad).getByRole('button', { name: 'Henlegg søknaden' })).toBeVisible();
    expect(within(samtykke).getByRole('radio', { name: 'Ja' })).toBeChecked();
  }
});

it('låser skjemaet hvis grunnlaget og flyten har ulike versjoner', async () => {
  const flyt = {
    ...PostmottakFlytResponse,
    flyt: under18Flyt,
    aktivGruppe: 'UNDER18' as const,
    aktivtSteg: 'AVKLAR_UNDER18_SAMTYKKE' as const,
    behandlingVersjon: 5,
  };
  setPostmottakMockFlytResponse(flyt);
  vi.mocked(hentFlyt).mockResolvedValue({ type: 'SUCCESS', status: 200, data: flyt });

  render(await Under18MedDataFetching({ behandlingsreferanse: '456' }));

  expect(screen.queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
});

it('låser samtykkekortet før behandlingen har nådd samtykkesteget', async () => {
  const flyt: BehandlingFlytOgTilstand = {
    ...PostmottakFlytResponse,
    flyt: under18Flyt,
    aktivGruppe: 'UNDER18',
    aktivtSteg: 'AVKLAR_UNDER18',
    behandlingVersjon: 4,
    visning: { ...PostmottakFlytResponse.visning, typeBehandling: 'Under18', readOnly: false },
  };
  setPostmottakMockFlytResponse(flyt);
  vi.mocked(hentFlyt).mockResolvedValue({ type: 'SUCCESS', status: 200, data: flyt });

  render(await Under18MedDataFetching({ behandlingsreferanse: '456' }));

  const samtykke = screen.getByRole('region', { name: 'Avklar samtykke' });
  expect(within(samtykke).queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
  expect(within(samtykke).queryByRole('button', { name: 'Lagre svar' })).not.toBeInTheDocument();
  expect(
    within(screen.getByRole('region', { name: 'Avklar søknaden' })).getByRole('button', { name: 'Lagre svar' })
  ).toBeVisible();
});
