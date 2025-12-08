import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, PeriodisertForutgåendeMedlemskapGrunnlag } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { Behovstype } from 'lib/utils/form';
import { ForutgåendeMedlemskapPeriodisert } from 'components/behandlinger/forutgåendemedlemskap/manuellvurderingperiodisert/ForutgåendeMedlemskapPeriodisert';

const grunnlag: PeriodisertForutgåendeMedlemskapGrunnlag = {
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
  overstyrt: false,
};
const grunnlagMedBekreftetVurdering: PeriodisertForutgåendeMedlemskapGrunnlag = {
  nyeVurderinger: [
    {
      fom: '2025-11-01',
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      harForutgåendeMedlemskap: true,
      overstyrt: false,
      vurdertAv: {
        dato: '2025-11-01',
        ident: 'Saksbehandler',
      },
    },
  ],
  kanVurderes: [
    {
      fom: '2025-11-01',
      tom: '2030-11-01',
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
  overstyrt: false,
};

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_MEDLEMSKAP' });
});

describe('Generelt', () => {
  it('Visning', () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      />
    );

    // heading
    const heading = screen.getByText('§ 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();

    // begrunnelse
    const begrunnelse = screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' });
    expect(begrunnelse).toBeVisible();

    // oppfylt
    const felt = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    expect(felt).toBeVisible();
  });

  it('Riktig overskrift ved overstyring', () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={true}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      />
    );

    // heading
    const heading = screen.getByText('Overstyring av § 11-2 Forutgående medlemskap');
    expect(heading).toBeVisible();
  });

  it('Betinget visning og feilmeldinger', async () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      />
    );

    // unntaksvilkår vises ikke før de skal
    expect(
      screen.queryByRole('group', {
        name: 'Oppfyller brukeren noen av unntaksvilkårene?',
      })
    ).not.toBeInTheDocument();

    // sjekk feilmelding hvis ingenting er fylt ut
    await trykkPåBekreft();
    expect(screen.getAllByText('Du må gi en begrunnelse på brukerens forutgående medlemskap')[0]).toBeVisible();
    expect(screen.getAllByText('Du må velge om brukeren har fem års forutgående medlemskap')[0]).toBeVisible();

    // velger at medlemskap ikke er oppfylt
    const oppfyller = screen.getByRole('group', {
      name: 'Har brukeren fem års forutgående medlemskap i folketrygden jf. § 11-2?',
    });
    const neiOppfyller = within(oppfyller).getByRole('radio', {
      name: 'Nei',
    });
    await user.click(neiOppfyller);

    // unntaksvilkår vises
    expect(
      screen.queryByRole('group', {
        name: 'Oppfyller brukeren noen av unntaksvilkårene?',
      })
    ).toBeInTheDocument();

    // sjekk feilmelding hvis ikke unntaksvilkår er fylt ut
    await trykkPåBekreft();
    expect(screen.getAllByText('Oppfyller brukeren noen av unntaksvilkårene?')[0]).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_GRUNNLAG' });

    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedBekreftetVurdering}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vurder brukerens forutgående medlemskap',
    });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
      name: 'Vurder brukerens forutgående medlemskap',
    });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
  });
});

describe('mellomlagring i forutgående medlemskap', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP,
      behandlingId: { id: 1 },
      data: '{"vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret","harForutgåendeMedlemskap":"false"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it(
    'Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre ' + 'mellomlagring',
    async () => {
      render(
        <ForutgåendeMedlemskapPeriodisert
          readOnly={false}
          behandlingVersjon={0}
          grunnlag={grunnlag}
          overstyring={false}
          behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
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
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
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
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /Vurder brukerens forutgående medlemskap/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedBekreftetVurdering}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /Vurder brukerens forutgående medlemskap/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
      ' her er ekstra tekst'
    );

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue('');
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedBekreftetVurdering}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const mockFetchResponseSlettMellomlagring: FetchResponse<object> = { type: 'SUCCESS', status: 202, data: {} };
    fetchMock.mockResponse(JSON.stringify(mockFetchResponseSlettMellomlagring));

    await user.type(
      screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' }),
      ' her er ekstra tekst'
    );

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Vurder brukerens forutgående medlemskap' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <ForutgåendeMedlemskapPeriodisert
        readOnly={true}
        behandlingVersjon={0}
        grunnlag={grunnlag}
        overstyring={false}
        behovstype={Behovstype.AVKLAR_FORUTGÅENDE_MEDLEMSKAP}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
