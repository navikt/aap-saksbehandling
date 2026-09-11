import { render, screen, within } from 'lib/test/CustomRender';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import {
  beregnTidligsteVirkningstidspunkt,
  SamordningGradering,
} from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
import { format, subWeeks } from 'date-fns';
import { MellomlagretVurderingResponse, SamordningGraderingGrunnlag } from 'lib/types/types';
import { beforeEach, describe, expect, it, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagMedVurdering: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  feriePerioder: [],
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
    vurderingerMeta: {},
  },
  historiskeVurderinger: [],
  ytelser: [],
};

const grunnlagUtenVurdering: SamordningGraderingGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  feriePerioder: [],
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

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_GRADERING' });
});

describe('Samordning gradering', () => {
  test('viser relevant informasjon fra søknaden når sykepenger og ferie er oppgitt', () => {
    const grunnlagMedSykepengerOgFerie: SamordningGraderingGrunnlag = {
      ...grunnlagUtenVurdering,
      mottarSykepenger: true,
      feriePerioder: [{ fom: '2025-06-01', tom: '2025-06-14' }],
    };

    render(<SamordningGradering grunnlag={grunnlagMedSykepengerOgFerie} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText('Mottar bruker sykepenger: Ja')).toBeVisible();
    expect(
      screen.getByText('Har bruker planer om ferie før de er ferdige med sykepenger: Ja, 01.06.2025 - 14.06.2025')
    ).toBeVisible();
  });

  test('viser ikke relevant informasjon fra søknaden når verdiene mangler', () => {
    render(<SamordningGradering grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.queryByText('Relevant informasjon fra søknaden')).not.toBeInTheDocument();
  });

  test('skal kunne redigere ytelse, periode og gradering for en manuell rad', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    await user.click(screen.getByRole('button', { name: 'Rediger' }));

    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('SYKEPENGER');
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toHaveValue(
      format(subWeeks(new Date(), 3), 'dd.MM.yyyy')
    );
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toHaveValue(format(new Date(), 'dd.MM.yyyy'));
    expect(screen.getByRole('textbox', { name: 'Utbetalingsgrad' })).toHaveValue('20');
  });

  test('lagrer endringer fra redigeringsmodalen tilbake til tabellen', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    await user.click(screen.getByRole('button', { name: 'Rediger' }));

    const gradering = screen.getByRole('textbox', { name: 'Utbetalingsgrad' });
    await user.clear(gradering);
    await user.type(gradering, '60');
    await user.click(screen.getByRole('button', { name: 'Lagre endringer' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    expect(within(rader[1]).getByText('60')).toBeVisible();
  });

  test('kan slette en rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);
    expect(screen.getByRole('button', { name: 'Slett' })).toBeVisible();
  });

  test('gir feilmelding dersom det er funnet ytelser fra kilder, men ikke gjort noen vurderinger', async () => {
    render(<SamordningGradering grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);
    await user.type(screen.getByRole('textbox', { name: 'Vurder vilkåret' }), 'Min begrunnelse');
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Du må gjøre en vurdering av periodene')).toBeVisible();
  });

  test('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    render(<SamordningGradering grunnlag={grunnlagMedVurdering} readOnly={false} behandlingVersjon={0} />);

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
      feriePerioder: [],
      historiskeVurderinger: [],
      ytelser: [],
    };

    render(<SamordningGradering grunnlag={etGrunnlag} readOnly={false} behandlingVersjon={0} />);

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

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
    expect(await screen.findByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
  });
});

describe('kopiering av perioder fra oppslag', () => {
  const grunnlagMedFlereYtelserOgVurdering: SamordningGraderingGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    feriePerioder: [],
    historiskeVurderinger: [],
    ytelser: [
      {
        gradering: 100,
        periode: { fom: '2025-03-01', tom: '2025-03-31' },
        endringStatus: 'NY',
        kilde: 'SP',
        ytelseType: 'SYKEPENGER',
      },
      {
        gradering: 50,
        periode: { fom: '2025-05-01', tom: '2025-05-31' },
        endringStatus: 'NY',
        kilde: 'FP',
        ytelseType: 'FORELDREPENGER',
      },
    ],
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      vurderinger: [
        {
          ytelseType: 'PLEIEPENGER',
          gradering: 20,
          manuell: true,
          periode: { fom: '2025-01-01', tom: '2025-01-31' },
        },
      ],
      vurderingerMeta: {},
    },
  };

  const grunnlagMedFerieISykepengeperiode: SamordningGraderingGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    feriePerioder: [],
    historiskeVurderinger: [],
    ytelser: [],
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      vurderinger: [
        {
          ytelseType: 'SYKEPENGER',
          gradering: 100,
          manuell: true,
          periode: { fom: '2026-01-01', tom: '2026-01-30' },
        },
        {
          ytelseType: 'FERIE_I_SYKEPENGEPERIODE',
          gradering: 0,
          manuell: true,
          periode: { fom: '2026-01-10', tom: '2026-01-16' },
        },
      ],
      vurderingerMeta: {},
    },
  };

  test('kopierer én periode fra oppslaget til en ny rad', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(3);
    expect(within(rader[2]).getByText('01.03.2025 - 31.03.2025')).toBeVisible();
    expect(within(rader[2]).getByText('Sykepenger')).toBeVisible();
  });

  test('kopierer alle perioder fra oppslaget uten å endre eksisterende rader', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Kopier alle perioder' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(4);
    expect(within(rader[1]).getByText('01.01.2025 - 31.01.2025')).toBeVisible();
    expect(within(rader[1]).getByText('Pleiepenger')).toBeVisible();

    expect(within(rader[2]).getByText('01.03.2025 - 31.03.2025')).toBeVisible();
    expect(within(rader[2]).getByText('Sykepenger')).toBeVisible();

    expect(within(rader[3]).getByText('01.05.2025 - 31.05.2025')).toBeVisible();
    expect(within(rader[3]).getByText('Foreldrepenger')).toBeVisible();
  });

  test('setter ikke samordningsgrad på kopierte rader', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(within(rader[2]).getAllByRole('cell')[2]).toBeEmptyDOMElement();
  });

  test('viser ikke kopier-knapper når oppslaget er tomt', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.queryByRole('button', { name: 'Kopier periode' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Kopier alle perioder' })).not.toBeInTheDocument();
  });

  test('kopier-knappene er deaktivert når kortet er readOnly', () => {
    render(<SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={true} />);

    expect(screen.getAllByRole('button', { name: 'Kopier periode' })[0]).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Kopier alle perioder' })).toBeDisabled();
  });

  test('viser ikke kopier-knapper når kopierPerioder-toggelen er av', () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, kopierPerioder: false }}>
        <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    expect(screen.queryByRole('button', { name: 'Kopier periode' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Kopier alle perioder' })).not.toBeInTheDocument();
  });

  test('lar ferie i sykepengeperiode velges også når autoSplittSykepenger-toggelen er av', async () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: false }}>
        <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Legg til' }));

    expect(
      within(screen.getByRole('combobox', { name: 'Ytelsestype' })).getByRole('option', {
        name: 'Ferie i sykepengeperiode',
      })
    ).toBeInTheDocument();
  });

  test('splitter ikke sykepengeperioden mot ferie når autoSplittSykepenger-toggelen er av', () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: false }}>
        <SamordningGradering grunnlag={grunnlagMedFerieISykepengeperiode} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(3);
    expect(within(rader[1]).getByText('01.01.2026 - 30.01.2026')).toBeVisible();
  });

  test('splitter sykepengeperioden mot ferie når autoSplittSykepenger-toggelen er på', () => {
    render(<SamordningGradering grunnlag={grunnlagMedFerieISykepengeperiode} behandlingVersjon={1} readOnly={false} />);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(4);
    expect(within(rader[1]).getByText('01.01.2026 - 09.01.2026')).toBeVisible();
    expect(within(rader[2]).getByText('10.01.2026 - 16.01.2026')).toBeVisible();
    expect(within(rader[3]).getByText('17.01.2026 - 06.02.2026')).toBeVisible();
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
        grunnlag={grunnlagUtenVurdering}
        readOnly={false}
        behandlingVersjon={0}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <SamordningGradering
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
    render(<SamordningGradering behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder vilkåret',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningGradering
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

  it('Skal ikke være mulig å slette mellomlagring hvis det er readOnly', () => {
    render(
      <SamordningGradering
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

describe('beregnTidligsteVirkningstidspunkt', () => {
  const ytelse = (fom: string, tom: string, gradering: number) => ({
    gradering,
    periode: { fom, tom },
    ytelseType: 'SYKEPENGER' as const,
    manuell: true,
  });

  it('returnerer undefined når det ikke finnes perioder med gradering 100', () => {
    expect(
      beregnTidligsteVirkningstidspunkt([ytelse('01.01.2025', '31.01.2025', 50)], new Date(2025, 0, 1))
    ).toBeUndefined();
  });

  it('returnerer undefined når samordninger er tom', () => {
    expect(beregnTidligsteVirkningstidspunkt([], new Date(2025, 0, 1))).toBeUndefined();
  });

  it('finner første hull mellom perioder', () => {
    const samordninger = [
      ytelse('01.01.2025', '10.01.2025', 100),
      ytelse('11.01.2025', '12.01.2025', 100),
      ytelse('15.01.2025', '18.01.2025', 100),
      ytelse('01.02.2025', '10.02.2025', 100),
    ];
    expect(beregnTidligsteVirkningstidspunkt(samordninger, new Date(2025, 0, 1))).toBe('13.01.2025');
  });

  it('returnerer dagen etter siste tom når det ikke finnes hull', () => {
    const samordninger = [ytelse('01.01.2025', '10.01.2025', 100), ytelse('11.01.2025', '31.01.2025', 100)];
    expect(beregnTidligsteVirkningstidspunkt(samordninger, new Date(2025, 0, 1))).toBe('01.02.2025');
  });

  it('bruker rettighetsperiodeFom som startpunkt og oppdager hull før første periode', () => {
    const samordninger = [ytelse('15.01.2025', '31.01.2025', 100)];
    expect(beregnTidligsteVirkningstidspunkt(samordninger, new Date(2025, 0, 1))).toBe('01.01.2025');
  });

  it('ignorerer perioder med gradering som ikke er 100', () => {
    const samordninger = [
      ytelse('01.01.2025', '10.01.2025', 100),
      ytelse('11.01.2025', '20.01.2025', 50),
      ytelse('25.01.2025', '31.01.2025', 100),
    ];
    // 50%-perioden ignoreres → hull mellom 10jan og 25jan
    expect(beregnTidligsteVirkningstidspunkt(samordninger, new Date(2025, 0, 1))).toBe('11.01.2025');
  });

  it('håndterer enkelt periode uten hull', () => {
    expect(beregnTidligsteVirkningstidspunkt([ytelse('01.01.2025', '31.01.2025', 100)], new Date(2025, 0, 1))).toBe(
      '01.02.2025'
    );
  });

  it('sorterer perioder etter fom selv om de er usortert', () => {
    const samordninger = [
      ytelse('15.01.2025', '18.01.2025', 100),
      ytelse('01.01.2025', '10.01.2025', 100),
      ytelse('11.01.2025', '12.01.2025', 100),
    ];
    // Etter sortering: 1jan-10jan, 11jan-12jan, 15jan-18jan → hull 13jan
    expect(beregnTidligsteVirkningstidspunkt(samordninger, new Date(2025, 0, 1))).toBe('13.01.2025');
  });
});
