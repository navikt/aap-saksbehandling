import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { Refusjon } from 'components/behandlinger/sykdom/refusjon/Refusjon';
import { MellomlagretVurderingResponse, RefusjonskravGrunnlag } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'REFUSJON_KRAV' });
});

const grunnlagMedVurdering: RefusjonskravGrunnlag = {
  gjeldendeVurderinger: [
    {
      fom: null,
      tom: null,
      harKrav: true,
      vurdertAv: { ansattnavn: 'Saksbehandler1', dato: '01.01.2026', enhetsnavn: 'Nav Løten', ident: '124567' },
    },
  ],
  gjeldendeVurdering: {
    fom: null,
    tom: null,
    harKrav: true,
    vurdertAv: { ansattnavn: 'Saksbehandler1', dato: '01.01.2026', enhetsnavn: 'Nav Løten', ident: '124567' },
  },
  harTilgangTilÅSaksbehandle: true,
};

const grunnlagUtenVurdering: RefusjonskravGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
};

describe('Refusjonskrav sosialstønad', () => {
  it('Skal ha korrekt overskrift', () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);
    const heading = screen.getByText('Sosialstønad refusjonskrav');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for om det er refusjonskrav', () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);
    const harRefusjonKrav = screen.getByRole('group', {
      name: 'Er det refusjonskrav fra Nav-kontor?',
    });
    expect(harRefusjonKrav).toBeVisible();
  });

  it('Viser felt for navkontor om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());
    expect(await finnNavkontorListe()).toBeInTheDocument();
  });

  it('Viser ikke felt for navkontor om bruker har refusjonskrav', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgNei(finnGruppeVelgRefusjonskrav());
    expect(await finnNavkontorListeQuery()).not.toBeInTheDocument();
  });

  it('Gir feilmelding ved manglende Nav-kontor', async () => {
    render(<Refusjon readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

    expect(finnGruppeVelgRefusjonskrav()).toBeVisible();

    await velgJa(finnGruppeVelgRefusjonskrav());

    await trykkPåBekreft();
    const feilmelding = await screen.findByText('Du må velge et Nav-kontor');
    expect(feilmelding).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    render(<Refusjon grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    await velgNei(finnGruppeVelgRefusjonskrav());

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const refusjonskravEtterAvbryt = within(
      screen.getByRole('group', {
        name: /Er det refusjonskrav fra Nav-kontor?/,
      })
    ).getByRole('radio', { name: 'Ja' });
    expect(refusjonskravEtterAvbryt).toBeChecked();
  });

  const finnGruppeVelgRefusjonskrav = () => screen.getByRole('group', { name: 'Er det refusjonskrav fra Nav-kontor?' });

  const finnNavkontorListe = async () => screen.findByRole('combobox', { name: 'Søk opp Nav-kontor' });
  const finnNavkontorListeQuery = async () => screen.queryByRole('combobox', { name: 'Søk opp Nav-kontor' });

  const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));

  const velgJa = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Ja' }));
  };

  const velgNei = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Nei' }));
  };
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{"harKrav":"nei", "refusjoner": []}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  // const wtf = '{"harKrav": "ja", "refusjoner": [{"fom": "02.09.2025", "tom": "01.09.2026", "navKontor": {"label": "Nav Løten - 0415", "value": "Nav Løten - 0415"}}, {"fom": "10.09.2025", "tom": "10.09.2027", "navKontor": {"label": "Nav Asker - 0220", "value": "Nav Asker - 0220"}}]}'
  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <Refusjon
        grunnlag={grunnlagUtenVurdering}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it(
    'Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre ' + 'mellomlagring',
    async () => {
      render(<Refusjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);

      await user.click(
        within(
          screen.getByRole('group', {
            name: 'Er det refusjonskrav fra Nav-kontor?',
          })
        ).getByRole('radio', { name: 'Ja' })
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
    }
  );

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <Refusjon
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
      <Refusjon
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const refusjonskravFelt = within(
      screen.getByRole('group', {
        name: 'Er det refusjonskrav fra Nav-kontor?',
      })
    ).getByRole('radio', { name: 'Nei' });

    expect(refusjonskravFelt).toBeChecked();
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<Refusjon behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const refusjonskravFelt = within(
      screen.getByRole('group', {
        name: 'Er det refusjonskrav fra Nav-kontor?',
      })
    ).getByRole('radio', { name: 'Ja' });

    expect(refusjonskravFelt).toBeChecked();
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Refusjon
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const refusjonskravFelt = within(
      screen.getByRole('group', {
        name: 'Er det refusjonskrav fra Nav-kontor?',
      })
    ).getByRole('radio', { name: 'Ja' });

    await user.click(refusjonskravFelt);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Er det refusjonskrav fra Nav-kontor?',
        })
      ).getByRole('radio', { name: 'Ja' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Er det refusjonskrav fra Nav-kontor?',
        })
      ).getByRole('radio', { name: 'Ja' })
    ).not.toBeChecked();
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Refusjon
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.click(
      within(
        screen.getByRole('group', {
          name: 'Er det refusjonskrav fra Nav-kontor?',
        })
      ).getByRole('radio', { name: 'Nei' })
    );

    expect(
      within(
        screen.getByRole('group', {
          name: 'Er det refusjonskrav fra Nav-kontor?',
        })
      ).getByRole('radio', { name: 'Nei' })
    ).toBeChecked();

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));
    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      within(
        screen.getByRole('group', {
          name: 'Er det refusjonskrav fra Nav-kontor?',
        })
      ).getByRole('radio', { name: 'Ja' })
    ).toBeChecked();
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <Refusjon
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
