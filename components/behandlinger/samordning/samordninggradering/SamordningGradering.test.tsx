import { render, screen, act } from 'lib/test/CustomRender';
import { FeatureFlagProvider } from 'context/UnleashContext';
import { mockedFlags } from 'lib/services/unleash/unleashToggles';
import { SamordningGradering } from 'components/behandlinger/samordning/samordninggradering/SamordningGradering';
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

  test('skal kunne redigere ytelse, periode og gradering for en manuell rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);
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

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(screen.getByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
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

  test('kopierer én periode fra oppslaget til en ny rad', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    const ytelseFelter = screen.getAllByRole('combobox', { name: 'Ytelsestype' });

    expect(fomFelter).toHaveLength(2);
    expect(fomFelter[1]).toHaveValue('01.03.2025');
    expect(tomFelter[1]).toHaveValue('31.03.2025');
    expect(ytelseFelter[1]).toHaveValue('SYKEPENGER');
  });

  test('kopierer alle perioder fra oppslaget uten å endre eksisterende rader', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Kopier alle perioder' }));

    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    const ytelseFelter = screen.getAllByRole('combobox', { name: 'Ytelsestype' });

    expect(fomFelter).toHaveLength(3);
    expect(fomFelter[0]).toHaveValue('01.01.2025');
    expect(ytelseFelter[0]).toHaveValue('PLEIEPENGER');

    expect(fomFelter[1]).toHaveValue('01.03.2025');
    expect(ytelseFelter[1]).toHaveValue('SYKEPENGER');

    expect(fomFelter[2]).toHaveValue('01.05.2025');
    expect(ytelseFelter[2]).toHaveValue('FORELDREPENGER');
  });

  test('setter ikke samordningsgrad på kopierte rader', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    expect(screen.getAllByRole('textbox', { name: 'Utbetalingsgrad' })[1]).toHaveValue('');
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
});

describe('ferie i sykepengeperiode', () => {
  const grunnlagMedSykepengerad: SamordningGraderingGrunnlag = {
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
          periode: { fom: '2025-03-01', tom: '2025-03-31' },
        },
      ],
      vurderingerMeta: {},
    },
  };

  async function leggInnFerie(fom: string, tom: string) {
    await user.click(screen.getByRole('button', { name: 'Legg til' }));

    const ytelseFelter = screen.getAllByRole('combobox', { name: 'Ytelsestype' });
    await user.selectOptions(ytelseFelter[ytelseFelter.length - 1], 'FERIE_I_SYKEPENGEPERIODE');

    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    await user.type(fomFelter[fomFelter.length - 1], fom);

    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    await user.type(tomFelter[tomFelter.length - 1], tom);

    await user.click(screen.getByRole('textbox', { name: 'Vurder vilkåret' }));
  }

  function perioder() {
    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    return fomFelter.map(
      (fom, index) => `${(fom as HTMLInputElement).value} - ${(tomFelter[index] as HTMLInputElement).value}`
    );
  }

  test('viser tekst om at ferie fra sykepenger splitter opp sykepengeperioden', () => {
    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    expect(
      screen.getByText('Ferie fra sykepenger splitter opp eventuell sykepengeperiode i samme tidsrom.')
    ).toBeVisible();
  });

  test('deler opp sykepengeperioden og skyver de resterende dagene til etter ferien', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    await leggInnFerie('10.03.2025', '14.03.2025');

    expect(perioder()).toEqual(['01.03.2025 - 09.03.2025', '15.03.2025 - 05.04.2025', '10.03.2025 - 14.03.2025']);
  });

  test('lar sykepengeperioden være i fred når ferien ikke overlapper', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    await leggInnFerie('01.06.2025', '10.06.2025');

    expect(perioder()).toEqual(['01.03.2025 - 31.03.2025', '01.06.2025 - 10.06.2025']);
  });

  test('regner om fra den opprinnelige perioden når feriedatoene rettes', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    await leggInnFerie('10.03.2025', '14.03.2025');

    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    await user.clear(fomFelter[2]);
    await user.type(fomFelter[2], '20.03.2025');
    await user.clear(tomFelter[2]);
    await user.type(tomFelter[2], '21.03.2025');
    await user.click(screen.getByRole('textbox', { name: 'Vurder vilkåret' }));

    expect(perioder()).toEqual(['01.03.2025 - 19.03.2025', '22.03.2025 - 02.04.2025', '20.03.2025 - 21.03.2025']);
  });

  test('markerer de endrede sykepengeradene', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    await leggInnFerie('10.03.2025', '14.03.2025');

    expect(document.querySelectorAll('[data-splittet="true"]')).toHaveLength(2);
  });

  test('fjerner markeringen etter ti sekunder', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const bruker = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<SamordningGradering grunnlag={grunnlagMedSykepengerad} behandlingVersjon={1} readOnly={false} />);

    await bruker.click(screen.getByRole('button', { name: 'Legg til' }));
    const ytelseFelter = screen.getAllByRole('combobox', { name: 'Ytelsestype' });
    await bruker.selectOptions(ytelseFelter[ytelseFelter.length - 1], 'FERIE_I_SYKEPENGEPERIODE');
    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    await bruker.type(fomFelter[fomFelter.length - 1], '10.03.2025');
    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    await bruker.type(tomFelter[tomFelter.length - 1], '14.03.2025');
    await bruker.click(screen.getByRole('textbox', { name: 'Vurder vilkåret' }));

    expect(document.querySelectorAll('[data-splittet="true"]')).toHaveLength(2);

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(document.querySelectorAll('[data-splittet="true"]')).toHaveLength(0);
    vi.useRealTimers();
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
