import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'lib/test/CustomRender';
import { FastsettManuellInntekt } from 'components/behandlinger/grunnlag/fastsettmanuellinntekt/FastsettManuellInntekt';
import { ManuellInntektGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const user = userEvent.setup();

const grunnlag: ManuellInntektGrunnlag = {
  sisteRelevanteÅr: 0,
  registrerteInntekterSisteRelevanteAr: [],
  ar: 0,
  gverdi: 100000,
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
};

const grunnlagMedVurdering: ManuellInntektGrunnlag = {
  sisteRelevanteÅr: 0,
  registrerteInntekterSisteRelevanteAr: [],
  ar: 0,
  gverdi: 100000,
  harTilgangTilÅSaksbehandle: true,
  historiskeVurderinger: [],
  vurdering: {
    ar: 2020,
    begrunnelse: 'Dette er en begrunnelse',
    vurdertAv: {
      dato: '2020-05-01',
      ident: 'Lokalsaksbehandler',
    },
    belop: 500000,
  },
};

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'MANGLENDE_LIGNING' });
});

describe('Fastsett manuell inntekt', () => {
  beforeEach(() => render(<FastsettManuellInntekt behandlingsversjon={1} grunnlag={grunnlag} readOnly={false} />));

  it('skal ha en alert', () => {
    const alert = screen.getByText(
      'Du må oppgi pensjonsgivende inntekt for siste beregningsår, fordi ingen inntekt er registrert. Om brukeren ikke har hatt inntekt for gitt år, legg inn 0.'
    );
    expect(alert).toBeVisible();
  });

  it('skal ha et felt for begrunnelse', () => {
    const felt = screen.getByRole('textbox', { name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})` });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for begrunnelse dersom det ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må gi en begrunnelse.');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt for å oppgi inntekt', () => {
    const felt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding på felt for å oppgi inntekt dersom det ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Du må oppgi inntekt for det siste året.');
    expect(feilmelding).toBeVisible();
  });

  it('skal gi en feilmelding på felt for å oppgi inntekt er negativ', async () => {
    const felt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });

    await user.type(felt, '-100');

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);

    const feilmelding = screen.getByText('Inntekt kan ikke være negativ.');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise G verdi på hva som har blitt skrevet inn', async () => {
    const felt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });

    expect(screen.getByText('0.00 G')).toBeVisible();

    await user.type(felt, '200 000');

    expect(screen.getByText('2.00 G')).toBeVisible();
  });
});
describe('Fastsett manuell inntekt vurdering', () => {
  beforeEach(() =>
    render(<FastsettManuellInntekt behandlingsversjon={1} grunnlag={grunnlagMedVurdering} readOnly={false} />)
  );

  it('skal vise hvem som har gjort vurderingen dersom det har blitt gjort en vurdering', () => {
    const vurdertAvTekst = screen.getByText('Vurdert av Lokalsaksbehandler, 01.05.2020');
    expect(vurdertAvTekst).toBeVisible();
  });

  it('feltene skal ha default value dersom vurdering har blitt gjort', () => {
    const begrunnelseFelt = screen.getByRole('textbox', {
      name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
    });
    expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');

    const inntektFelt = screen.getByRole('spinbutton', { name: 'Oppgi inntekt' });
    expect(inntektFelt).toHaveValue(500000);
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'IKKE_OPPFYLT_MELDEPLIKT' });

    render(<FastsettManuellInntekt behandlingsversjon={1} grunnlag={grunnlagMedVurdering} readOnly={false} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Begrunn inntekt for siste beregningsår (0) Begrunn inntekt for siste beregningsår (0)',
    });

    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: '' });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er en begrunnelse');
  });
});

describe('Fastsett manuell inntekt readOnly', () => {
  it('Skal ikke vise bekreft knapp dersom readOnly er true', () => {
    render(<FastsettManuellInntekt behandlingsversjon={0} grunnlag={grunnlag} readOnly={true} />);
    const bekreftKnapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(bekreftKnapp).not.toBeInTheDocument();
  });

  it('Skal vise bekreft knapp dersom readOnly er false', () => {
    render(<FastsettManuellInntekt behandlingsversjon={0} grunnlag={grunnlag} readOnly={false} />);
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(bekreftKnapp).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const fetchMock = createFetchMock(vi);
  fetchMock.enableMocks();

  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '7001',
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <FastsettManuellInntekt
        behandlingsversjon={0}
        grunnlag={grunnlag}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<FastsettManuellInntekt behandlingsversjon={0} grunnlag={grunnlag} readOnly={false} />);

    await user.type(
      screen.getByRole('textbox', { name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})` }),
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
      <FastsettManuellInntekt
        behandlingsversjon={0}
        grunnlag={grunnlag}
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
      <FastsettManuellInntekt
        behandlingsversjon={0}
        grunnlag={grunnlag}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
    });
    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<FastsettManuellInntekt behandlingsversjon={0} grunnlag={grunnlagMedVurdering} readOnly={false} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
    });
    expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FastsettManuellInntekt
        behandlingsversjon={0}
        grunnlag={grunnlag}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
    });

    await user.type(begrunnelseFelt, ' her er ekstra tekst');
    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);
    expect(begrunnelseFelt).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <FastsettManuellInntekt
        behandlingsversjon={0}
        grunnlag={grunnlagMedVurdering}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: `Begrunn inntekt for siste beregningsår (${grunnlag.ar})`,
    });

    await user.type(begrunnelseFelt, ' her er ekstra tekst');
    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);
    expect(begrunnelseFelt).toHaveValue('Dette er en begrunnelse');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(<FastsettManuellInntekt behandlingsversjon={0} grunnlag={grunnlag} readOnly={true} />);

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();

    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});
