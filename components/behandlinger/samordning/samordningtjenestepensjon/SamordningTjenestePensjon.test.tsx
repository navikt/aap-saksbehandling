import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { MellomlagretVurderingResponse, SamordningTjenestePensjonGrunnlag } from 'lib/types/types';
import { SamordningTjenestePensjon } from 'components/behandlinger/samordning/samordningtjenestepensjon/SamordningTjenestePensjon';
import userEvent from '@testing-library/user-event';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: SamordningTjenestePensjonGrunnlag = {
  harTilgangTilÅSaksbehandle: false,
  tjenestepensjonYtelser: [
    {
      ytelse: 'ALDER',
      ordning: { navn: 'SPK', tpNr: '1234', orgNr: '1235' },
      ytelseIverksattFom: '2020-01-01',
      ytelseIverksattTom: '2020-02-02',
    },
  ],
};

const grunnlagMedVurdering: SamordningTjenestePensjonGrunnlag = {
  harTilgangTilÅSaksbehandle: false,
  tjenestepensjonRefusjonskravVurdering: {
    begrunnelse: 'Dette er min vurdering som er bekreftet',
    harKrav: true,
  },
  tjenestepensjonYtelser: [
    {
      ytelse: 'ALDER',
      ordning: { navn: 'SPK', tpNr: '1234', orgNr: '1235' },
      ytelseIverksattFom: '2020-01-01',
      ytelseIverksattTom: '2020-02-02',
    },
  ],
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SAMORDNING_TJENESTEPENSJON_REFUSJONSKRAV' });
});

describe('Refusjon tjenestepensjon', () => {
  const user = userEvent.setup();

  it('skal ha en tabell med kolonnene periode, ordning og ytelse', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);

    const periodeKolonne = screen.getByRole('columnheader', {
      name: 'Periode',
    });
    const ordningKolonne = screen.getByRole('columnheader', {
      name: 'Ordning',
    });
    const ytelseKolonne = screen.getByRole('columnheader', {
      name: 'Ytelse',
    });

    expect(periodeKolonne).toBeVisible();
    expect(ordningKolonne).toBeVisible();
    expect(ytelseKolonne).toBeVisible();
  });

  it('skal ha verdi i tabellen dersom det er tjenestepensjon ytelser', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);
    const periodeCelle = screen.getByRole('cell', {
      name: '01.01.2020 - 02.02.2020',
    });
    const ordningCelle = screen.getByRole('cell', {
      name: 'SPK',
    });
    const ytelseCelle = screen.getByRole('cell', {
      name: 'ALDER',
    });

    expect(periodeCelle).toBeVisible();
    expect(ordningCelle).toBeVisible();
    expect(ytelseCelle).toBeVisible();
  });

  it('skal ha et begrunnelse felt', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);
    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vurdering' });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal ha et felt for om etterbetaling skal holdes igjen for perioden', () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);
    const felt = screen.getByRole('group', { name: 'Skal etterbetaling holdes igjen for perioden?' });
    expect(felt).toBeVisible();
  });

  it('skal vise feilmeldinger dersom feltene ikke er besvart', async () => {
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={1} readOnly={false} />);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });

    await user.click(bekreftKnapp);

    const feilmeldingBegrunnelse = screen.getByText('Du må gi en begrunnelse.');
    const feilmeldingFeltForEtterbetaling = screen.getByText('Du må svare på om etterbetalingen skal holdes igjen.');
    expect(feilmeldingBegrunnelse).toBeVisible();
    expect(feilmeldingFeltForEtterbetaling).toBeVisible();
  });
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
      <SamordningTjenestePensjon
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
    render(<SamordningTjenestePensjon grunnlag={grunnlagUtenVurdering} behandlingVersjon={0} readOnly={false} />);

    await user.type(screen.getByRole('textbox', { name: 'Vurdering' }), 'Her har jeg begynt å skrive en vurdering..');
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
      <SamordningTjenestePensjon
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
      <SamordningTjenestePensjon
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurdering',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<SamordningTjenestePensjon behandlingVersjon={0} readOnly={false} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurdering',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningTjenestePensjon
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <SamordningTjenestePensjon
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={grunnlagMedVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <SamordningTjenestePensjon
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
