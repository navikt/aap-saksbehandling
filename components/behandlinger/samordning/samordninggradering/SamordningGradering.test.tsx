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
      screen.getByText('Har bruker planer om ferie før de er ferdige med sykepenger: Ja', { exact: false })
    ).toBeVisible();
    expect(screen.getByText('01.06.2025 - 14.06.2025')).toBeVisible();
  });

  test('viser ikke relevant informasjon fra søknaden når verdiene mangler', () => {
    render(<SamordningGradering grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.queryByText('Relevant informasjon fra søknaden')).not.toBeInTheDocument();
  });

  test('skal kunne redigere ytelse, periode og gradering direkte i tabellen for en manuell rad', () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('SYKEPENGER');
    expect(screen.getByRole('textbox', { name: 'Fra og med' })).toHaveValue(
      format(subWeeks(new Date(), 3), 'dd.MM.yyyy')
    );
    expect(screen.getByRole('textbox', { name: 'Til og med' })).toHaveValue(format(new Date(), 'dd.MM.yyyy'));
    expect(screen.getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('20');
  });

  test('lagrer endringer i tabellen direkte uten modal', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    const gradering = screen.getByRole('textbox', { name: 'Samordningsgrad' });
    await user.clear(gradering);
    await user.type(gradering, '60');

    expect(gradering).toHaveValue('60');
  });

  test('ferie i sykepengeperiode kan ikke velges i den vanlige ytelsestype-velgeren når autoSplittSykepenger-toggelen er på', () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: true }}>
        <SamordningGradering grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    expect(
      within(screen.getByRole('combobox', { name: 'Ytelsestype' })).queryByRole('option', {
        name: 'Ferie i sykepengeperiode',
      })
    ).not.toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    const fom = screen.getByRole('textbox', { name: 'Fra og med' });
    await user.type(fom, '31.10.2025');

    const tom = screen.getByRole('textbox', { name: 'Til og med' });
    await user.type(tom, '01.10.2025');

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(await screen.findByText('Fra og med dato kan ikke være etter til og med dato')).toBeVisible();
  });

  test('gir feilmelding når perioder overlapper, og fjerner den når overlappet er rettet', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    const etGrunnlag: SamordningGraderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      feriePerioder: [],
      historiskeVurderinger: [],
      ytelser: [],
    };

    render(<SamordningGradering grunnlag={etGrunnlag} readOnly={false} behandlingVersjon={0} />);

    await user.click(screen.getByRole('button', { name: 'Endre' }));
    await user.click(screen.getByRole('button', { name: 'Legg til folketrygdytelse' }));

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurder vilkåret' });
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    const fomFelter = screen.getAllByRole('textbox', { name: 'Fra og med' });
    const tomFelter = screen.getAllByRole('textbox', { name: 'Til og med' });
    const ytelsestypeFelter = screen.getAllByRole('combobox', { name: 'Ytelsestype' });
    const graderingFelter = screen.getAllByRole('textbox', { name: 'Samordningsgrad' });

    await user.type(fomFelter[0], '01.01.2025');
    await user.type(tomFelter[0], '31.01.2025');
    await user.selectOptions(ytelsestypeFelter[0], 'SYKEPENGER');
    await user.type(graderingFelter[0], '50');

    await user.type(fomFelter[1], '15.01.2025');
    await user.type(tomFelter[1], '15.02.2025');
    await user.selectOptions(ytelsestypeFelter[1], 'SYKEPENGER');
    await user.type(graderingFelter[1], '50');

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));

    expect(
      await screen.findByText('Periodene overlapper. Endre datoene slik at periodene ikke overlapper.')
    ).toBeVisible();

    await user.clear(tomFelter[1]);
    await user.type(tomFelter[1], '01.03.2025');

    expect(
      screen.queryByText('Periodene overlapper. Endre datoene slik at periodene ikke overlapper.')
    ).not.toBeInTheDocument();
  });

  test('viser feilmelding og åpner ikke ferie-modal dersom radene i tabellen ikke er gyldige', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    const etGrunnlag: SamordningGraderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      feriePerioder: [],
      historiskeVurderinger: [],
      ytelser: [],
    };

    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: true }}>
        <SamordningGradering grunnlag={etGrunnlag} readOnly={false} behandlingVersjon={0} />
      </FeatureFlagProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Endre' }));
    await user.click(screen.getByRole('button', { name: 'Legg til folketrygdytelse' }));

    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
    await user.click(screen.getByRole('button', { name: 'Legg til ferie i sykepengeperiode' }));

    expect(
      await screen.findByText('Du må rette opp feilene i tabellen før du kan legge til ferie i sykepengeperioden.')
    ).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Legg til ferie i sykepengeperiode' })).not.toBeInTheDocument();
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
    expect(within(rader[2]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.03.2025');
    expect(within(rader[2]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.03.2025');
    expect(within(rader[2]).getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('SYKEPENGER');
  });

  test('kopierer alle perioder fra oppslaget uten å endre eksisterende rader', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Kopier alle perioder' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(4);
    expect(within(rader[1]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2025');
    expect(within(rader[1]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.01.2025');
    expect(within(rader[1]).getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('PLEIEPENGER');

    expect(within(rader[2]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.03.2025');
    expect(within(rader[2]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.03.2025');
    expect(within(rader[2]).getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('SYKEPENGER');

    expect(within(rader[3]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.05.2025');
    expect(within(rader[3]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.05.2025');
    expect(within(rader[3]).getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('FORELDREPENGER');
  });

  test('kopiert periode får samordningsgrad lik graderingen fra kilden', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    // Ytelsen med indeks 0 (Sykepenger) har gradering 100 i grunnlaget
    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    const kopiertRad = rader[2];

    expect(within(kopiertRad).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('100');
  });

  test('kopiert periode får samordningsgrad 0 når kilden mangler gradering', async () => {
    const grunnlagMedYtelseUtenGraderingFraKilde: SamordningGraderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      feriePerioder: [],
      historiskeVurderinger: [],
      ytelser: [
        {
          gradering: undefined,
          periode: { fom: '2025-03-01', tom: '2025-03-31' },
          endringStatus: 'NY',
          kilde: 'SP',
          ytelseType: 'SYKEPENGER',
        },
      ],
    };

    render(
      <SamordningGradering grunnlag={grunnlagMedYtelseUtenGraderingFraKilde} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Kopier periode' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    const kopiertRad = rader[1];

    expect(within(kopiertRad).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('0');
  });

  test('kopiert periode får samordningsgrad 0 når kilden har gradering 0', async () => {
    const grunnlagMedGraderingNull: SamordningGraderingGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      feriePerioder: [],
      historiskeVurderinger: [],
      ytelser: [
        {
          gradering: 0,
          periode: { fom: '2025-03-01', tom: '2025-03-31' },
          endringStatus: 'NY',
          kilde: 'SP',
          ytelseType: 'SYKEPENGER',
        },
      ],
    };

    render(<SamordningGradering grunnlag={grunnlagMedGraderingNull} behandlingVersjon={1} readOnly={false} />);

    await user.click(screen.getByRole('button', { name: 'Kopier periode' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    const kopiertRad = rader[1];

    expect(within(kopiertRad).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('0');
  });

  test('kopiert periode formaterer fom/tom til norsk datoformat og beholder ytelsestype', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    // Ytelsen med indeks 1 (Foreldrepenger) har periode 2025-05-01 - 2025-05-31 i grunnlaget (ISO-format)
    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[1]);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    const kopiertRad = rader[2];

    expect(within(kopiertRad).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.05.2025');
    expect(within(kopiertRad).getByRole('textbox', { name: 'Til og med' })).toHaveValue('31.05.2025');
    expect(within(kopiertRad).getByRole('combobox', { name: 'Ytelsestype' })).toHaveValue('FORELDREPENGER');
  });

  test('kopiert rad kan redigeres og slettes, siden den er markert som manuell', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Kopier periode' })[0]);

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    const kopiertRad = rader[2];

    expect(within(kopiertRad).getByRole('textbox', { name: 'Samordningsgrad' })).toBeEnabled();
    expect(within(kopiertRad).getByRole('button', { name: 'Slett' })).toBeEnabled();
  });

  test('kopiering av alle perioder setter samordningsgrad for hver rad basert på kildens gradering', async () => {
    render(
      <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Kopier alle perioder' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    // rader[1] er den eksisterende, manuelt vurderte perioden (Pleiepenger, gradering 20)
    expect(within(rader[1]).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('20');
    // rader[2] er kopiert fra Sykepenger (gradering 100 i kilden)
    expect(within(rader[2]).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('100');
    // rader[3] er kopiert fra Foreldrepenger (gradering 50 i kilden)
    expect(within(rader[3]).getByRole('textbox', { name: 'Samordningsgrad' })).toHaveValue('50');
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

  test('kan legge til ferie i sykepengeperiode via egen modal når autoSplittSykepenger-toggelen er på', async () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: true }}>
        <SamordningGradering grunnlag={grunnlagMedFlereYtelserOgVurdering} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Legg til ferie i sykepengeperiode' }));

    expect(screen.getByRole('heading', { name: 'Legg til ferie i sykepengeperiode' })).toBeVisible();

    await user.type(screen.getByRole('textbox', { name: 'Fra og med' }), '01.06.2025');
    await user.type(screen.getByRole('textbox', { name: 'Til og med' }), '14.06.2025');
    await user.click(screen.getByRole('button', { name: 'Legg til periode' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');
    expect(within(rader[rader.length - 1]).getByText('Ferie i sykepengeperiode')).toBeVisible();
  });

  test('splitter ikke sykepengeperioden mot ferie når autoSplittSykepenger-toggelen er av', () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: false }}>
        <SamordningGradering grunnlag={grunnlagMedFerieISykepengeperiode} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(3);
    expect(within(rader[1]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2026');
    expect(within(rader[1]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('30.01.2026');
  });

  test('flytter splitten når en ferieperiode innsnevres, uten å etterlate udekkede dager', async () => {
    render(
      <FeatureFlagProvider flags={{ ...mockedFlags, autoSplittSykepenger: true }}>
        <SamordningGradering grunnlag={grunnlagMedFerieISykepengeperiode} behandlingVersjon={1} readOnly={false} />
      </FeatureFlagProvider>
    );

    const ferieRadFørRedigering = within(
      within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row')[2]
    );
    await user.click(ferieRadFørRedigering.getByRole('button', { name: 'Rediger' }));

    const dialog = within(screen.getByRole('dialog'));

    const fom = dialog.getByRole('textbox', { name: 'Fra og med' });
    await user.clear(fom);
    await user.type(fom, '12.01.2026');

    const tom = dialog.getByRole('textbox', { name: 'Til og med' });
    await user.clear(tom);
    await user.type(tom, '14.01.2026');

    await user.click(dialog.getByRole('button', { name: 'Lagre endringer' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(4);
    expect(within(rader[1]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2026');
    expect(within(rader[1]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('11.01.2026');
    expect(within(rader[2]).getByText('12.01.2026 - 14.01.2026')).toBeVisible();
    expect(within(rader[3]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('15.01.2026');
    expect(within(rader[3]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('02.02.2026');
  });

  test('gjenoppretter én sammenhengende sykepengeperiode når ferien slettes', async () => {
    render(<SamordningGradering grunnlag={grunnlagMedFerieISykepengeperiode} behandlingVersjon={1} readOnly={false} />);

    const ferieRad = within(
      within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row')[2]
    );
    await user.click(ferieRad.getByRole('button', { name: 'Slett' }));

    const rader = within(screen.getByRole('table', { name: 'Perioder med samordning' })).getAllByRole('row');

    expect(rader).toHaveLength(2);
    expect(within(rader[1]).getByRole('textbox', { name: 'Fra og med' })).toHaveValue('01.01.2026');
    expect(within(rader[1]).getByRole('textbox', { name: 'Til og med' })).toHaveValue('30.01.2026');
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
