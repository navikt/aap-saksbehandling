import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, OppholdskravGrunnlagResponse } from 'lib/types/types';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { OppholdskravSteg } from 'components/behandlinger/oppholdskrav/OppholdskravSteg';
import { Behovstype } from 'lib/utils/form';

const oppholdskravGrunnlag: OppholdskravGrunnlagResponse = {
  nyeVurderinger: [],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};
const oppholdskravGrunnlagMedBekreftetVurdering: OppholdskravGrunnlagResponse = {
  nyeVurderinger: [{ begrunnelse: 'Dette er min vurdering som er bekreftet', oppfylt: true, fom: '2025-10-10' }],
  kanVurderes: [
    {
      fom: '2025-10-10',
      tom: '2030-10-10',
    },
  ],
  sisteVedtatteVurderinger: [],
  behøverVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
};

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_OPPHOLDSKRAV' });
});

describe('Generelt', () => {
  it('Visning', () => {
    render(<OppholdskravSteg readOnly={false} behandlingVersjon={0} grunnlag={oppholdskravGrunnlag} />);

    // heading
    const heading = screen.getByText('Oppholdskrav § 11-3');
    expect(heading).toBeVisible();

    // begrunnelse
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();

    // oppfylt
    const felt = screen.getByRole('group', {
      name: 'Oppfyller brukeren vilkårene i § 11-3?',
    });
    expect(felt).toBeVisible();
  });

  it('Betinget visning og feilmeldinger', async () => {
    render(<OppholdskravSteg readOnly={false} behandlingVersjon={0} grunnlag={oppholdskravGrunnlag} />);

    // landvelger og annet tekstfelt vises ikke før de skal
    expect(
      screen.queryByRole('combobox', {
        name: 'Hvilket land oppholder brukeren seg i?',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', {
        name: 'Navn på land',
      })
    ).not.toBeInTheDocument();

    // sjekk feilmelding på oppfylt
    await trykkPåBekreft();
    expect(screen.getAllByText('Du må ta stilling til om brukeren oppfyller vilkårene')[0]).toBeVisible();

    // velg oppfylt ja
    const oppfyller = screen.getByRole('group', {
      name: 'Oppfyller brukeren vilkårene i § 11-3?',
    });
    const neiOppfyller = within(oppfyller).getByRole('radio', {
      name: 'Nei',
    });
    await user.click(neiOppfyller);

    // vis landkomboboks
    expect(
      await screen.findByRole(
        'combobox',
        {
          name: 'Hvilket land oppholder brukeren seg i?',
        },
        { timeout: 5000 }
      )
    ).toBeVisible();

    // sjekk feilmelding på landvelger
    await trykkPåBekreft();
    expect(screen.getAllByText('Du må velge et land')[0]).toBeVisible();

    // velg annet
    const land = await screen.findByRole('combobox', {
      name: 'Hvilket land oppholder brukeren seg i?',
    });
    await user.click(land);

    await user.type(land, 'annet');

    const annet = screen.getByText('Annet');
    await user.click(annet);

    // vis annet tekstbox
    expect(
      await screen.findByRole(
        'textbox',
        {
          name: 'Navn på land',
        },
        { timeout: 5000 }
      )
    ).toBeVisible();

    // feilmeldinger
    await trykkPåBekreft();

    expect(screen.getAllByText('Du må fylle ut en vilkårsvurdering')[0]).toBeVisible();
    expect(screen.getAllByText('Du må skrive inn navnet på landet')[0]).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'FASTSETT_GRUNNLAG' });

    render(
      <OppholdskravSteg grunnlag={oppholdskravGrunnlagMedBekreftetVurdering} readOnly={false} behandlingVersjon={0} />
    );

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', {
      name: 'Vilkårsvurdering',
    });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
  });
});

describe('mellomlagring i oppholdskrav', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.OPPHOLDSKRAV_KODE,
      behandlingId: { id: 1 },
      data: '{"vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret","oppfyller":"ja"}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <OppholdskravSteg
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={oppholdskravGrunnlag}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
      />
    );

    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it(
    'Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre ' + 'mellomlagring',
    async () => {
      render(<OppholdskravSteg behandlingVersjon={0} readOnly={false} grunnlag={oppholdskravGrunnlag} />);

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
      <OppholdskravSteg
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={oppholdskravGrunnlag}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
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
      <OppholdskravSteg
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={oppholdskravGrunnlag}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <OppholdskravSteg behandlingVersjon={0} readOnly={false} grunnlag={oppholdskravGrunnlagMedBekreftetVurdering} />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <OppholdskravSteg
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
        grunnlag={oppholdskravGrunnlag}
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
      <OppholdskravSteg
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
        grunnlag={oppholdskravGrunnlagMedBekreftetVurdering}
      />
    );

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
      <OppholdskravSteg
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagring={mellomlagring.mellomlagretVurdering}
        grunnlag={oppholdskravGrunnlag}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});

const trykkPåBekreft = async () => await user.click(screen.getByRole('button', { name: 'Bekreft' }));
