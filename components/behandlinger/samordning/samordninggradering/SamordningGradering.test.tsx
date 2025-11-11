import { render, screen } from 'lib/test/CustomRender';
import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { format, subWeeks } from 'date-fns';
import { MellomlagretVurderingResponse, SamordningGraderingGrunnlag } from 'lib/types/types';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { BrukerInformasjon } from 'lib/services/azure/azureUserService';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagMedVurdering: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vurdering: {
    begrunnelse: 'Dette er min vurdering som er bekreftet',
    vurderinger: [
      {
        ytelseType: 'SYKEPENGER',
        gradering: 20,
        manuell: true,
        periode: {
          fom: format(subWeeks(new Date(), 3), 'yyyy-MM-dd'),
          tom: format(new Date(), 'yyyy-MM-dd'),
        },
      },
    ],
  },
  historiskeVurderinger: [],
  ytelser: [],
};

const grunnlagUtenVurdering: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  ytelser: [
    {
      gradering: 100,
      periode: {
        fom: '2025-03-01',
        tom: '2025-03-31',
      },
      endringStatus: 'NY',
      kilde: 'SP',
      ytelseType: 'SYKEPENGER',
    },
  ],
  historiskeVurderinger: [],
};

const bruker: BrukerInformasjon = {
  navn: 'Iren Panikk',
  NAVident: 'z123456',
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_GRADERING' });
});

describe('Samordning gradering', () => {
  test('skal kunne redigere ytelse, periode og gradering for en manuell rad', () => {
    render(
      <SamordningGradering bruker={bruker} grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />
    );
    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Til og med' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toBeEnabled();

    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toBeEnabled();
  });

  test('kan slette en rad', () => {
    render(
      <SamordningGradering bruker={bruker} grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />
    );
    expect(screen.getByRole('button', { name: 'Slett' })).toBeVisible();
  });

  test('gir feilmelding dersom det er funnet ytelser fra kilder, men ikke gjort noen vurderinger', async () => {
    render(
      <SamordningGradering bruker={bruker} grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />
    );
    await user.type(screen.getByRole('textbox', { name: 'Vurder vilkåret' }), 'Min begrunnelse');
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må gjøre en vurdering av periodene')).toBeVisible();
  });

  test('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    render(
      <SamordningGradering bruker={bruker} grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurder vilkåret' });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vurder vilkåret' });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  test('gir feilmelding når periodeslutt er før periodestart', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    const etGrunnlag: SamordningGraderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      historiskeVurderinger: [],
      ytelser: [],
    };

    render(<SamordningGradering bruker={bruker} grunnlag={etGrunnlag} readOnly={false} behandlingVersjon={0} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    await user.click(screen.getByRole('button', { name: 'Legg til folketrygdytelse' }));

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurder vilkåret' });
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');

    await user.click(screen.getByRole('button', { name: 'Legg til' }));

    const fom = screen.getByRole('textbox', { name: 'Fra og med' });
    await user.type(fom, '31.10.2025');

    const tom = screen.getByRole('textbox', { name: 'Til og med' });
    await user.type(tom, '01.10.2025');

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(screen.getByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.FASTSETT_BEREGNINGSTIDSPUNKT_KODE,
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <SamordningGradering
        bruker={bruker}
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
    render(
      <SamordningGradering bruker={bruker} grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Vurder vilkåret' }),
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
      <SamordningGradering
        bruker={bruker}
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
      <SamordningGradering
        bruker={bruker}
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder vilkåret',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <SamordningGradering bruker={bruker} behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder vilkåret',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningGradering
        bruker={bruker}
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurder vilkåret' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurder vilkåret' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder vilkåret' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningGradering
        bruker={bruker}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurder vilkåret' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurder vilkåret' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder vilkåret' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SamordningGradering
        bruker={bruker}
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
