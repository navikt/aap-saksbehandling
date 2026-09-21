import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { Avslag11_27 } from 'components/behandlinger/samordning/avslag11_27/Avslag11_27';
import { Avslag11_27Grunnlag, MellomlagretVurdering } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const ref1 = 'ref-uuid-1';
const ref2 = 'ref-uuid-2';

const brukersYtelse: Avslag11_27Grunnlag['brukersYtelseAlternativer'] = [
  'OMSORGSPENGER',
  'FORELDREPENGER',
  'FERIE_I_SYKEPENGEPERIODE',
  'SYKEPENGER',
  'OPPLÆRINGSPENGER',
  'PLEIEPENGER',
  'SVANGERSKAPSPENGER',
];

const grunnlagUtenVurdering: Avslag11_27Grunnlag = {
  brukersYtelseAlternativer: brukersYtelse,
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
  ],
  vurderinger: null,
  vedtatteVurdering: null,
};

const grunnlagMedToKravUtenVurdering: Avslag11_27Grunnlag = {
  brukersYtelseAlternativer: brukersYtelse,
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
    {
      referanse: ref2,
      søknadsdokument: 'JP-002',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-03-01',
      muligRettighetFra: '2026-03-15',
    },
  ],
  vurderinger: null,
  vedtatteVurdering: null,
};

const grunnlagMedVurdering: Avslag11_27Grunnlag = {
  brukersYtelseAlternativer: brukersYtelse,
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
  ],
  vurderinger: [
    {
      referanse: ref1,
      begrunnelse: 'Eksisterende begrunnelse',
      harAnnenFullYtelse: true,
      brukersYtelse: 'SYKEPENGER',
      brukersYtelseTom: '2026-06-30',
      harSykepengegrunnlagOver2G: true,
      harArbeidsgiverSykepengerUtbetaling: true,
      skalAvslås1127: true,
    },
  ],
  vedtatteVurdering: null,
};

const grunnlagMedVedtattOgNyVurdering: Avslag11_27Grunnlag = {
  brukersYtelseAlternativer: brukersYtelse,
  harTilgangTilÅSaksbehandle: true,
  krav: [
    {
      referanse: ref1,
      søknadsdokument: 'JP-001',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-01-15',
      muligRettighetFra: '2026-02-01',
    },
    {
      referanse: ref2,
      søknadsdokument: 'JP-002',
      type: 'RELEVANT_KRAV',
      søknadsdato: '2026-03-01',
      muligRettighetFra: '2026-03-15',
    },
  ],
  vurderinger: [
    {
      referanse: ref2,
      begrunnelse: 'Nåværende vurdering gjenopptak',
      harAnnenFullYtelse: false,
      brukersYtelse: null,
      brukersYtelseTom: null,
      harArbeidsgiverSykepengerUtbetaling: null,
      skalAvslås1127: false,
    },
  ],
  vedtatteVurdering: [
    {
      referanse: ref1,
      begrunnelse: 'Vedtatt vurdering fra førstegangsbehandling',
      harAnnenFullYtelse: true,
      brukersYtelse: 'SYKEPENGER',
      brukersYtelseTom: '2026-06-30',
      harSykepengegrunnlagOver2G: true,
      harArbeidsgiverSykepengerUtbetaling: true,
      skalAvslås1127: true,
      vurderingerMeta: {
        vurdertAv: { ident: 'Z123456', dato: '2025-12-01' },
      },
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_AVSLAG_11_27' });
});

describe('Avslag11_27 - krav vises', () => {
  it('viser alle krav fra grunnlaget', () => {
    render(<Avslag11_27 grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText('JP-001')).toBeVisible();
    expect(screen.getByText('Nytt krav om AAP')).toBeVisible();
  });

  it('viser overskrift for steget', () => {
    render(<Avslag11_27 grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(
      screen.getByText('§ 11-27 Brukeren har annen full trygdeytelse i en lengre periode etter AAP søknad')
    ).toBeVisible();
  });

  it('viser flere krav samtidig når grunnlaget inneholder flere', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVedtattOgNyVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText('JP-001')).toBeVisible();
    expect(screen.getByText('JP-002')).toBeVisible();
  });
});

describe('Avslag11_27 - skjema vises/skjules', () => {
  it('viser skjema automatisk når det kun finnes ett krav, selv uten eksisterende vurdering', () => {
    render(<Avslag11_27 grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText(/Ny vurdering/)).toBeVisible();
  });

  it('viser ikke skjema automatisk for krav uten nåværende vurdering når det finnes flere krav', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedToKravUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.queryByText(/Ny vurdering/)).not.toBeInTheDocument();
  });

  it('viser "Legg til vurdering"-knapp for hvert krav når det finnes flere krav uten vurdering', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedToKravUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getAllByRole('button', { name: 'Legg til vurdering' })).toHaveLength(2);
  });

  it('viser skjema etter klikk på "Legg til vurdering"', async () => {
    render(<Avslag11_27 grunnlag={grunnlagMedToKravUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    await user.click(screen.getAllByRole('button', { name: 'Legg til vurdering' })[0]);

    expect(screen.getByText(/Ny vurdering/)).toBeVisible();
  });

  it('viser skjema automatisk for krav med eksisterende vurdering', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText(/Ny vurdering/)).toBeVisible();
  });
});

describe('Avslag11_27 - defaultverdier fra grunnlag', () => {
  it.each([['Eksisterende begrunnelse'], ['30.06.2026']] as const)(
    'fyller inn verdi %s fra eksisterende vurdering',
    (forventetVerdi) => {
      render(<Avslag11_27 grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

      expect(screen.getByDisplayValue(forventetVerdi)).toBeInTheDocument();
    }
  );

  it('bruker mellomlagring som defaultValue fremfor grunnlag', () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: 'Mellomlagret begrunnelse',
              behøverVurdering: true,
              erNyVurdering: false,
              harAnnenFullYtelse: 'Ja',
              brukersYtelse: 'SYKEPENGER',
              brukersYtelseTom: '30.06.2026',
              harSykepengegrunnlagOver2G: 'Ja',
              harArbeidsgiverSykepengerUtbetaling: 'Ja',
              skalAvslås1127: 'Ja',
            },
          },
        ],
      }),
      vurdertAv: 'Z123456',
      vurdertDato: '2026-01-01T12:00:00',
    };

    render(
      <Avslag11_27
        grunnlag={grunnlagMedVurdering}
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    expect(screen.getByDisplayValue('Mellomlagret begrunnelse')).toBeInTheDocument();
  });

  it('viser skjema automatisk basert på mellomlagring selv om det finnes flere krav', () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: 'Mellomlagret begrunnelse',
              behøverVurdering: true,
              erNyVurdering: true,
              harAnnenFullYtelse: 'Ja',
              brukersYtelse: 'SYKEPENGER',
              brukersYtelseTom: '30.06.2026',
              harSykepengegrunnlagOver2G: 'Ja',
              harArbeidsgiverSykepengerUtbetaling: 'Ja',
              skalAvslås1127: 'Ja',
            },
          },
          {
            vurdering: {
              referanse: ref2,
              begrunnelse: '',
              behøverVurdering: true,
              erNyVurdering: true,
              harAnnenFullYtelse: undefined,
              brukersYtelse: undefined,
              brukersYtelseTom: undefined,
              harSykepengegrunnlagOver2G: undefined,
              harArbeidsgiverSykepengerUtbetaling: undefined,
              skalAvslås1127: undefined,
            },
          },
        ],
      }),
      vurdertAv: 'Z123456',
      vurdertDato: '2026-01-01T12:00:00',
    };

    render(
      <Avslag11_27
        grunnlag={grunnlagMedToKravUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    expect(screen.getByDisplayValue('Mellomlagret begrunnelse')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Legg til vurdering' })).toBeVisible();
  });
});

describe('Avslag11_27 - vedtatte vurderinger', () => {
  it('viser vedtatt vurdering for revurdering', async () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVedtattOgNyVurdering} behandlingVersjon={1} readOnly={false} />);

    // ref1 er vedtatt — kortet er kollaps, ekspander det
    const kortHeader = screen.getByText(/januar/i);
    await user.click(kortHeader);

    expect(screen.getByText('Vedtatt vurdering fra førstegangsbehandling')).toBeVisible();
  });

  it('viser "Legg til vurdering"-knapp for krav uten synlig skjema selv med vedtatt vurdering', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVedtattOgNyVurdering} behandlingVersjon={1} readOnly={false} />);

    // ref1 har vedtatt vurdering og ingen nåværende vurdering → skjema vises ikke automatisk
    expect(screen.getByRole('button', { name: 'Legg til vurdering' })).toBeVisible();
  });

  it('viser skjema direkte for krav med nåværende vurdering selv om det finnes vedtatt vurdering for et annet krav', () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVedtattOgNyVurdering} behandlingVersjon={1} readOnly={false} />);

    expect(screen.getByText('JP-002')).toBeVisible();
    expect(screen.getByText(/Ny vurdering/)).toBeVisible();
  });
});

describe('Avslag11_27 - validering', () => {
  it('viser feil ved innsending uten noen utfylt vurdering og uten eksisterende vurdering', async () => {
    render(<Avslag11_27 grunnlag={grunnlagMedToKravUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.getByText('Du må legge til minst én vurdering.')).toBeVisible();
  });

  it('validerer ikke når det allerede finnes en nåværende vurdering', async () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVurdering} behandlingVersjon={1} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.queryByText('Du må legge til minst én vurdering.')).not.toBeInTheDocument();
  });

  it('validerer ikke når det finnes en vedtatt vurdering fra før', async () => {
    render(<Avslag11_27 grunnlag={grunnlagMedVedtattOgNyVurdering} behandlingVersjon={1} readOnly={false} />);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.queryByText('Du må legge til minst én vurdering.')).not.toBeInTheDocument();
  });
});

describe('Avslag11_27 - mellomlagring', () => {
  it('viser mellomlagringstekst med dato og bruker', () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: '',
              behøverVurdering: true,
              erNyVurdering: true,
              harAnnenFullYtelse: undefined,
              brukersYtelse: undefined,
              brukersYtelseTom: undefined,
              harSykepengegrunnlagOver2G: undefined,
              harArbeidsgiverSykepengerUtbetaling: undefined,
              skalAvslås1127: undefined,
            },
          },
        ],
      }),
      vurdertAv: 'Jan T. Loven',
      vurdertDato: '2026-01-15T10:30:00',
    };

    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    expect(screen.getByText(/Utkast lagret.*Jan T. Loven/)).toBeVisible();
  });

  it('sletter mellomlagring og nullstiller skjema', async () => {
    const mellomlagring: MellomlagretVurdering = {
      avklaringsbehovkode: Behovstype.VURDER_AVSLAG_11_27,
      behandlingId: { id: 1 },
      data: JSON.stringify({
        avslag11_27vurderinger: [
          {
            vurdering: {
              referanse: ref1,
              begrunnelse: 'Mellomlagret',
              behøverVurdering: true,
              erNyVurdering: false,
              harAnnenFullYtelse: 'Ja',
              brukersYtelse: 'SYKEPENGER',
              brukersYtelseTom: '30.06.2026',
              harSykepengegrunnlagOver2G: 'Ja',
              harArbeidsgiverSykepengerUtbetaling: 'Ja',
              skalAvslås1127: 'Ja',
            },
          },
        ],
      }),
      vurdertAv: 'Z123456',
      vurdertDato: '2026-01-01T12:00:00',
    };

    const mockResponse: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockResponse));

    render(
      <Avslag11_27
        grunnlag={grunnlagUtenVurdering}
        behandlingVersjon={1}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring}
      />
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.queryByText(/Utkast lagret/)).not.toBeInTheDocument();
  });
});

describe('Avslag11_27 - slett og legg til vurdering igjen', () => {
  it('krever ny utfylt vurdering etter sletting dersom ingen annen vurdering eksisterer', async () => {
    render(<Avslag11_27 grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    // eneste krav → skjema vises automatisk uten å måtte klikke "Legg til vurdering"
    expect(screen.getByText(/Ny vurdering/)).toBeVisible();

    const slettKnapp = screen.getByRole('button', { name: 'Fjern vurdering' });
    await user.click(slettKnapp);

    const bekreftSlettKnapp = screen.getByRole('button', { name: 'Slett' });
    await user.click(bekreftSlettKnapp);

    const lagreKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(lagreKnapp);

    expect(screen.getByText('Du må legge til minst én vurdering.')).toBeVisible();
  });
});
