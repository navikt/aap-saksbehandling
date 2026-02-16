import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, OvergangUforeGrunnlag } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { OvergangUforePeriodisert } from 'components/behandlinger/sykdom/overgangufore/OvergangUforePeriodisert';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'OVERGANG_UFORE' });
});

const overganguforeGrunnlag: OvergangUforeGrunnlag = {
  ikkeRelevantePerioder: [],
  gjeldendeSykdsomsvurderinger: [],
  gjeldendeVedtatteVurderinger: [],
  historiskeVurderinger: [],
  perioderSomIkkeErTilstrekkeligVurdert: [],
  nyeVurderinger: [],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  harTilgangTilÅSaksbehandle: true,
};
const overganguforeGrunnlagMedBekreftetVurdering: OvergangUforeGrunnlag = {
  ikkeRelevantePerioder: [],
  gjeldendeSykdsomsvurderinger: [],
  gjeldendeVedtatteVurderinger: [],
  historiskeVurderinger: [],
  perioderSomIkkeErTilstrekkeligVurdert: [],
  nyeVurderinger: [
    {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      brukerHarSøktUføretrygd: true,
      brukerHarFåttVedtakOmUføretrygd: 'JA_INNVILGET_FULL',
      brukerRettPåAAP: true,
      virkningsdato: '',
      fom: '2025-10-10',
      vurdertAv: { dato: '2025-10-10', ident: 'FASF343' },
    },
  ],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  harTilgangTilÅSaksbehandle: true,
};

describe('mellomlagring i overgang uføre', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5031',
      behandlingId: { id: 1 },
      data: '{"vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret","brukerRettPåAAP":"ja","brukerHarSøktOmUføretrygd":"ja","brukerHarFåttVedtakOmUføretrygd": "NEI"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <OvergangUforePeriodisert
        grunnlag={overganguforeGrunnlag}
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
      render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} behandlingVersjon={0} readOnly={false} />);

      await user.type(
        screen.getByRole('textbox', { name: 'Vilkårsvurdering' }),
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
    }
  );

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <OvergangUforePeriodisert
        grunnlag={overganguforeGrunnlag}
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
      <OvergangUforePeriodisert
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={overganguforeGrunnlag}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <OvergangUforePeriodisert
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={overganguforeGrunnlagMedBekreftetVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <OvergangUforePeriodisert
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={overganguforeGrunnlag}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <OvergangUforePeriodisert
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overganguforeGrunnlagMedBekreftetVurdering}
      />
    );

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    await user.type(screen.getByRole('textbox', { name: 'Vilkårsvurdering' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });
    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <OvergangUforePeriodisert
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overganguforeGrunnlag}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

describe('Førstegangsbehandling', () => {
  it('Skal ha en overskrift', () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('§ 11-18 AAP under behandling av krav om uføretrygd');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har søkt om uføretrygd', () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', {
      name: 'Har brukeren søkt om uføretrygd?',
    });
    expect(felt).toBeVisible();
  });

  it('Viser felt om brukeren har fått vedtak om uføretrygd, dersom brukeren ikke har søkt', async () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);

    expect(finnGruppeForSoktOmUforetrygd()).toBeVisible();

    await velgJa(finnGruppeForSoktOmUforetrygd());
    expect(finnGruppeForVedtakOmUforetrygd()).toBeVisible();
  });

  it('Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?', async () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);
    await velgJa(finnGruppeForSoktOmUforetrygd());
    const fåttVedtak = finnGruppeForVedtakOmUforetrygd();
    await user.click(within(fåttVedtak).getByRole('radio', { name: 'Nei' }));
    expect(finnGruppeForRettPåAAP()).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_BISTANDSBEHOV' });

    render(
      <OvergangUforePeriodisert
        grunnlag={overganguforeGrunnlagMedBekreftetVurdering}
        readOnly={false}
        behandlingVersjon={0}
      />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    // Accordion lukker seg når det ikke er aktivt
    await user.click(
      screen.getByRole('button', {
        name: /ny vurdering: 10. oktober 2025/i,
      })
    );

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    // Accordion lukker seg når det ikke er aktivt
    await user.click(
      screen.getByRole('button', {
        name: /ny vurdering: 10. oktober 2025/i,
      })
    );

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal vise en info alert hvis bruker har uføre vedtak etter søknad', async () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);
    const harBrukerSøktOmUføretrygd = finnGruppeForSoktOmUforetrygd();
    await velgJa(harBrukerSøktOmUføretrygd);

    const harBrukerFåttVedtakPåSøknadenOmUføretrygd = finnGruppeForVedtakOmUforetrygd();
    const jaValg = within(harBrukerFåttVedtakPåSøknadenOmUføretrygd).getByRole('radio', {
      name: 'Ja, brukeren har fått innvilget full uføretrygd',
    });
    await user.click(jaValg);

    const infoTekst = screen.getByText(
      'Pass på at datoen vurderingen gjelder fra skal være samme som vedtaksdato på uførevedtaket.'
    );

    expect(infoTekst).toBeVisible();
  });

  it('Skal vise en info alert hvis bruker venter på uføre vedtak, men har AAP', async () => {
    render(<OvergangUforePeriodisert grunnlag={overganguforeGrunnlag} readOnly={false} behandlingVersjon={0} />);
    const harBrukerSøktOmUføretrygd = finnGruppeForSoktOmUforetrygd();
    await velgJa(harBrukerSøktOmUføretrygd);

    const harBrukerFåttVedtakPåSøknadenOmUføretrygd = finnGruppeForVedtakOmUforetrygd();
    const neiValg = within(harBrukerFåttVedtakPåSøknadenOmUføretrygd).getByRole('radio', {
      name: 'Nei',
    });
    await user.click(neiValg);

    const harBrukerRettPåAAP = finnGruppeForRettPåAAP();
    await velgJa(harBrukerRettPåAAP);

    const infoTekst = screen.getByText(
      'Pass på at datoen vurderingen gjelder fra er samme som søknadsdato om uføretrygd.'
    );

    expect(infoTekst).toBeVisible();
  });

  const finnGruppeForSoktOmUforetrygd = () => screen.getByRole('group', { name: 'Har brukeren søkt om uføretrygd?' });

  const finnGruppeForVedtakOmUforetrygd = () =>
    screen.getByRole('group', { name: 'Har brukeren fått vedtak på søknaden om uføretrygd?' });

  const finnGruppeForRettPåAAP = () =>
    screen.getByRole('group', {
      name: 'Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?',
    });

  const velgJa = async (group: HTMLElement) => {
    await user.click(within(group).getByRole('radio', { name: 'Ja' }));
  };
});
