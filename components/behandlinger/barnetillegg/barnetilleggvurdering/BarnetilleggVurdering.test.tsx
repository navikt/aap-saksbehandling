import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BarnetilleggVurdering } from 'components/behandlinger/barnetillegg/barnetilleggvurdering/BarnetilleggVurdering';
import { userEvent } from '@testing-library/user-event';
import { BarnetilleggGrunnlag, BehandlingPersoninfo, MellomlagretVurderingResponse } from 'lib/types/types';
import { render, screen, within } from 'lib/test/CustomRender';
import createFetchMock from 'vitest-fetch-mock';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'BARNETILLEGG' });
});

const barnSomTrengerVurderingFosterforelder: BarnetilleggGrunnlag['barnSomTrengerVurdering'][number] = {
  ident: {
    identifikator: '12345678910',
    aktivIdent: true,
  },
  fodselsDato: '2015-01-01',
  forsorgerPeriode: {
    fom: '2020-01-30',
    tom: '2038-01-30',
  },
  oppgittForeldreRelasjon: 'FOSTERFORELDER',
};

const vurdertBarnFosterForelder: BarnetilleggGrunnlag['vurderteBarn'][number] = {
  fødselsdato: '2023-05-05',
  ident: '1234567890',
  navn: 'Snill Såpe',
  oppgittForeldreRelasjon: 'FOSTERFORELDER',
  vurderinger: [
    {
      begrunnelse: 'en god begrunnelse',
      erFosterForelder: true,
      fraDato: '2023-05-05',
      harForeldreAnsvar: true,
    },
  ],
};
const grunnlag: BarnetilleggGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  søknadstidspunkt: '12.12.2023',
  folkeregisterbarn: [
    {
      ident: {
        identifikator: '01987654321',
        aktivIdent: true,
      },
      fodselsDato: '2023-06-05',
      forsorgerPeriode: {
        fom: '2020-02-02',
        tom: '2038-02-02',
      },
    },
  ],
  barnSomTrengerVurdering: [
    {
      ident: {
        identifikator: '12345678910',
        aktivIdent: true,
      },
      fodselsDato: '2023-05-05',
      forsorgerPeriode: {
        fom: '2020-01-30',
        tom: '2038-01-30',
      },
    },
  ],
  vurderteFolkeregisterBarn: [],
  vurderteBarn: [],
  saksbehandlerOppgitteBarn: [],
  vurderteSaksbehandlerOppgitteBarn: []
};

const behandlingPersonInfo: BehandlingPersoninfo = {
  info: {
    '01987654321': 'TOR NADO',
    '12345678910': 'HELLO PELLO',
  },
};

describe('barnetillegg', () => {
  it('skal ha en overskrift', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const overskrift = screen.getByText('§ 11-20 tredje og fjerde ledd barnetillegg');
    expect(overskrift).toBeVisible();
  });

  it('skal ha en heading for manuelle barn som er lagt inn av bruker', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const heading = screen.getByText('Følgende barn er oppgitt av bruker');
    expect(heading).toBeVisible();
  });

  it('skal ha en heading for registrerte barn fra folkeregisteret', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const heading = screen.getByText('Følgende barn er funnet i folkeregisteret');
    expect(heading).toBeVisible();
  });

  it('skal vise knapp for å fullføre steget dersom readonly er satt til false', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(knapp).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre steget dersom readonly er satt til true', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('skal ikke vise knapp for å fullføre steget dersom manuell vurdering er false', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={true}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('skal  vise knapp for å fullføre steget dersom det finnes manuell vurdering og readOnly er false', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.getByRole('button', { name: 'Bekreft' });
    expect(knapp).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'SIMULERING' });

    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, vurderteBarn: [vurdertBarnFosterForelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getAllByRole('textbox')[0];
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getAllByRole('textbox')[0];
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('en god begrunnelse');
  });
});

describe('Oppgitte barn', () => {
  const user = userEvent.setup();
  it('skal vise feilmelding dersom oppgitt tidspunkt er før fødselsdato', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        grunnlag={grunnlag}
        readOnly={false}
      />
    );

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', {
      name: 'Oppgi dato for når barnetillegget skal gis fra',
    });
    await user.type(datofelt, '01.01.2000');
    await klikkPåBekreft();
    const fødselsdato = grunnlag.barnSomTrengerVurdering[0].fodselsDato;

    const feilmelding = screen.getByText(`Dato kan ikke være før fødselsdato (${fødselsdato})`);
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et begrunnelsesfelt', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const felt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom begrunnelsesfelt ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må gi en begrunnelse');
    expect(feilmelding).toBeVisible();
  });

  it('skal ha et felt hvor det besvares om det skal beregnes barnetillegg for barnet', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const felt = screen.getByRole('group', {
      name: 'Skal brukeren få barnetillegg for barnet?',
    });
    expect(felt).toBeVisible();
  });

  it('skal gi en feilmelding dersom feltet om det skal beregnes barnetillegg ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må besvare om det skal beregnes barnetillegg for barnet');
    expect(feilmelding).toBeVisible();
  });

  it('oppgitt barn skal ha overskrift oppgitt fosterbarn dersom oppgittforeldrerelasjon er FOSTERFORELDER', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, barnSomTrengerVurdering: [barnSomTrengerVurderingFosterforelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = screen.getByText('Oppgitt fosterbarn');
    expect(el).toBeVisible();
  });

  it('oppgitt barn skal ha overskrift oppgitt barn dersom oppgittforeldrerelasjon ikke er FOSTERFORELDER', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = screen.getByText('Oppgitt barn');
    expect(el).toBeVisible();
  });

  it('skal vise spørsmål om fosterhjem dersom oppgittforeldrerelasjon er FOSTERFORELDER', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, barnSomTrengerVurdering: [barnSomTrengerVurderingFosterforelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = screen.getByText('Har fosterhjemsordningen vart i to år eller er den av varig karakter?');
    expect(el).toBeInTheDocument();
  });

  it('skal ikke vise spørsmål om fosterhjem dersom oppgittforeldrerelasjon er  noe annet enn FOSTERFORELDER', async () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = await screen.queryByText('Har fosterhjemsordningen vart i to år eller er den av varig karakter?');
    expect(el).not.toBeInTheDocument();
  });

  it('skal vise spørsmål om fosterhjem dersom det er besvart i en eksisterende vurdering', () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, vurderteBarn: [vurdertBarnFosterForelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = screen.getByText('Har fosterhjemsordningen vart i to år eller er den av varig karakter?');
    expect(el).toBeInTheDocument();
  });

  it('skal ikke vise spørsmål om fosterhjem dersom det ikke er besvart i en eksisterende vurdering', async () => {
    render(
      <BarnetilleggVurdering
        grunnlag={grunnlag}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const el = await screen.queryByText('Har fosterhjemsordningen vart i to år eller er den av varig karakter?');
    expect(el).not.toBeInTheDocument();
  });

  it('skal ha et felt for å sette datoen brukeren har forsørgeransvar for barnet fra dersom det har blitt besvart ja på spørsmålet om det skal beregnes barnetillegg', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const forsørgerAnsvarFelt = screen.queryByRole('textbox', { name: 'Brukeren har forsørgeransvar for barnet fra' });
    expect(forsørgerAnsvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();

    const felt = screen.getByRole('textbox', { name: 'Oppgi dato for når barnetillegget skal gis fra' });
    expect(felt).toBeVisible();
  });

  it('skal ha vise feilmelding dersom feltet for datoen brukeren har forsørgeransvar for barnet fra ikke er besvart', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const forsørgeransvarFelt = screen.queryByRole('textbox', { name: 'Brukeren har forsørgeransvar for barnet fra' });
    expect(forsørgeransvarFelt).not.toBeInTheDocument();

    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    await fyllUtEnBegrunnelse();
    await klikkPåBekreft();

    const feilmelding = screen.getByText('Du må sette en dato');
    expect(feilmelding).toBeVisible();
  });

  it('gir en feilmelding dersom det legges inn en ugyldig verdi for når brukeren har foreldreansvar fra', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        grunnlag={grunnlag}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    await svarJaPåOmDetSkalBeregnesBarnetillegg();
    const datofelt = screen.getByRole('textbox', {
      name: 'Oppgi dato for når barnetillegget skal gis fra',
    });
    await user.type(datofelt, '12.2003');

    await klikkPåBekreft();

    const feilmelding = screen.getByText('Datoformatet er ikke gyldig. Dato må være på formatet dd.mm.åååå');
    expect(feilmelding).toBeVisible();
  });

  it('skal ikke vise knapp for å fullføre vurdering dersom readonly er satt til true', () => {
    render(
      <BarnetilleggVurdering
        readOnly={true}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.queryByRole('button', { name: 'Bekreft' });
    expect(knapp).not.toBeInTheDocument();
  });

  it('skal ha en knapp for å legge til flere vurderinger', () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    const knapp = screen.getAllByRole('button', { name: 'Legg til vurdering' })[0];
    expect(knapp).toBeInTheDocument();
  });

  it('skal være mulig å legge til flere vurderinger', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    const begrunnelsesFelterFørDetErLagtTilEnNy = screen.getAllByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });

    expect(begrunnelsesFelterFørDetErLagtTilEnNy.length).toBe(1);

    const knapp = screen.getAllByRole('button', { name: 'Legg til vurdering' })[0];
    await user.click(knapp);

    const begrunnelsesFelter = screen.getAllByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });

    expect(begrunnelsesFelter.length).toBe(2);
  });

  it('skal ikke være mulig å fjerne den første vurderinger', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(screen.queryByRole('button', { name: /fjern vurdering/i })).not.toBeInTheDocument();
  });

  it('knapp for å slette en vurdering skal vises dersom det legges til flere enn èn vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      }).length
    ).toBe(1);

    expect(screen.queryByRole('button', { name: /fjern vurdering/i })).not.toBeInTheDocument();

    const leggTilVurderingKnapp = screen.getAllByRole('button', { name: /legg til vurdering/i })[0];
    await user.click(leggTilVurderingKnapp);

    expect(
      screen.getAllByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      }).length
    ).toBe(2);

    expect(screen.getByRole('button', { name: /fjern vurdering/i })).toBeInTheDocument();
  });

  it('knapp for å legge til en ny vurdering skal ikke være synlig dersom det har blitt valgt nei på forsørgeransvar', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    expect(screen.getAllByRole('button', { name: /legg til vurdering/i }).length).toBe(2);

    await user.click(screen.getByRole('radio', { name: /nei/i }));

    expect(screen.getAllByRole('button', { name: /legg til vurdering/i }).length).toBe(1);
  });

  it('skal vise dato felt når man besvarer nei på forsørgeransvar så lenge det ikke er første vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await user.click(screen.getByRole('radio', { name: /ja/i }));

    await user.click(screen.getAllByRole('button', { name: 'Legg til vurdering' })[0]);

    await user.click(screen.getAllByRole('radio', { name: /nei/i })[1]);

    expect(screen.getByText('Forsørgeransvar opphører fra')).toBeInTheDocument();
  });

  it('skal vise dato felt når man besvarer nei på fosterhjem så lenge det ikke er første vurdering', async () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, barnSomTrengerVurdering: [barnSomTrengerVurderingFosterforelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await user.click(screen.getAllByRole('radio', { name: /ja/i })[0]);
    await user.click(screen.getAllByRole('radio', { name: /ja/i })[1]);

    await user.click(screen.getAllByRole('button', { name: 'Legg til vurdering' })[0]);

    const radioNos = screen.getAllByRole('radio', { name: /nei/i });
    await user.click(radioNos[2]);

    expect(screen.getByText('Forsørgeransvar opphører fra')).toBeInTheDocument();
  });

  it('skal ikke vise dato felt når man besvarer nei på forsørgeransvar i første vurdering', async () => {
    render(
      <BarnetilleggVurdering
        readOnly={false}
        grunnlag={grunnlag}
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );

    await user.click(screen.getByRole('radio', { name: /nei/i }));

    expect(screen.queryByRole('Forsørgeransvar opphører fra')).not.toBeInTheDocument();
  });

  async function svarJaPåOmDetSkalBeregnesBarnetillegg() {
    const skalBeregnesBarnetilleggFelt = screen.getByRole('group', {
      name: 'Skal brukeren få barnetillegg for barnet?',
    });
    const jaVerdi = within(skalBeregnesBarnetilleggFelt).getByRole('radio', { name: 'Ja' });

    await user.click(jaVerdi);
  }

  const fyllUtEnBegrunnelse = async () => {
    const begrunnelsesfelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });
    await user.type(begrunnelsesfelt, 'Dette er en begrunnelse');
  };

  const klikkPåBekreft = async () => {
    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
  };
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.VURDER_TREKK_AV_SØKNAD_KODE,
      behandlingId: { id: 1 },
      data: '{"barnetilleggVurderinger": [{"navn": "ISABELLA ORM", "ident": "01412086860", "vurderinger": [{"fraDato": "", "begrunnelse": "Dette er min vurdering som er mellomlagret", "harForeldreAnsvar": ""}], "fødselsdato": "2020-01-01"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: BarnetilleggGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    søknadstidspunkt: '2025-09-02',
    folkeregisterbarn: [],
    vurderteFolkeregisterBarn: [],
    vurderteBarn: [
      {
        ident: '01412086860',
        navn: null,
        vurderinger: [
          {
            fraDato: '2025-09-02',
            harForeldreAnsvar: false,
            begrunnelse: 'Dette er min vurdering som er bekreftet',
          },
        ],
        fødselsdato: '2020-01-01',
      },
    ],
    vurdertAv: {
      ident: 'KVALITETSSIKRER',
      dato: '2025-09-02',
      ansattnavn: 'KVALITETSSIKRER',
      enhetsnavn: 'Lokalenhetsnavn',
    },
    barnSomTrengerVurdering: [],
    saksbehandlerOppgitteBarn: [],
    vurderteSaksbehandlerOppgitteBarn: []
  };

  const grunnlagUtenVurdering: BarnetilleggGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    søknadstidspunkt: '2025-09-02',
    folkeregisterbarn: [],
    vurderteBarn: [],
    vurderteFolkeregisterBarn: [],
    barnSomTrengerVurdering: [
      {
        ident: {
          identifikator: '01412086860',
          aktivIdent: true,
        },
        fodselsDato: '2020-01-01',
        navn: 'ISABELLA ORM',
        forsorgerPeriode: {
          fom: '2020-01-01',
          tom: '2037-12-31',
        },
      },
    ],
    saksbehandlerOppgitteBarn: [],
    vurderteSaksbehandlerOppgitteBarn: []
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
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
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
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
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.queryByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      })
    ).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      }),
      ' her er ekstra tekst'
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      })
    ).toHaveValue('Dette er min vurdering som er mellomlagret her er ekstra tekst');

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      })
    ).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={true}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });

  it('Vilkårskortet skal være default åpen dersom det finnes en mellomlagret vurdering', () => {
    render(
      <BarnetilleggVurdering
        behandlingsversjon={1}
        behandlingPersonInfo={behandlingPersonInfo}
        readOnly={true}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    expect(
      screen.getByRole('textbox', {
        name: 'Vurder om brukeren har rett på barnetillegg for dette barnet',
      })
    ).toBeVisible();
  });
});

describe('reset felter ved endringer som påvirker visningslogikk', () => {
  async function svarPåOmFosteroppholdErVarig(svar: 'Ja' | 'Nei') {
    const fosterFelt = screen.getByRole('group', {
      name: 'Har fosterhjemsordningen vart i to år eller er den av varig karakter?',
    });
    const jaVerdi = within(fosterFelt).getByRole('radio', { name: svar });

    await user.click(jaVerdi);
  }
  async function svarPåOmDetSkalBeregnesBarnetillegg(svar: 'Ja' | 'Nei') {
    const skalBeregnesBarnetilleggFelt = screen.getByRole('group', {
      name: 'Skal brukeren få barnetillegg for barnet?',
    });
    const jaVerdi = within(skalBeregnesBarnetilleggFelt).getByRole('radio', { name: svar });

    await user.click(jaVerdi);
  }

  it('dato blir resatt hvis foreldreansvar endres', async () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, barnSomTrengerVurdering: [barnSomTrengerVurderingFosterforelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    await svarPåOmFosteroppholdErVarig('Ja');
    await svarPåOmDetSkalBeregnesBarnetillegg('Ja');
    const mindato = '01.01.2000';
    const datofelt = screen.getByRole('textbox', {
      name: 'Oppgi dato for når barnetillegget skal gis fra',
    });
    await user.type(datofelt, mindato);

    // endrer svar og så tilbake sånn at datofelt vises igjen
    await svarPåOmDetSkalBeregnesBarnetillegg('Nei');
    await svarPåOmDetSkalBeregnesBarnetillegg('Ja');

    expect(await screen.queryByDisplayValue(mindato)).not.toBeInTheDocument();
  });

  it('foreldreansvar og dato blir resatt hvis erFosterhjem endres', async () => {
    render(
      <BarnetilleggVurdering
        grunnlag={{ ...grunnlag, barnSomTrengerVurdering: [barnSomTrengerVurderingFosterforelder] }}
        behandlingsversjon={0}
        readOnly={false}
        behandlingPersonInfo={behandlingPersonInfo}
      />
    );
    await svarPåOmFosteroppholdErVarig('Ja');
    await svarPåOmDetSkalBeregnesBarnetillegg('Ja');
    const mindato = '01.01.2000';
    const datofelt = screen.getByRole('textbox', {
      name: 'Oppgi dato for når barnetillegget skal gis fra',
    });
    await user.type(datofelt, mindato);

    // endrer svar og så tilbake sånn at foreldreansvar radio og datofelt vises igjen
    await svarPåOmFosteroppholdErVarig('Nei');
    await svarPåOmFosteroppholdErVarig('Ja');

    expect(await screen.queryByDisplayValue(mindato)).not.toBeInTheDocument();
    const foreldreAnsvarRadio = screen.getByRole('group', {
      name: 'Skal brukeren få barnetillegg for barnet?',
    });
    const radios = within(foreldreAnsvarRadio).getAllByRole('radio');
    radios.forEach((radio) => expect(radio).toHaveProperty('checked', false));
  });
});
