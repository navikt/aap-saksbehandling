import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { Sykepengeerstatning } from 'components/behandlinger/sykdom/vurdersykepengeerstatning/Sykepengeerstatning';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, SykepengeerstatningGrunnlag } from 'lib/types/types';
import { Behovstype } from 'lib/utils/form';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'VURDER_SYKEPENGEERSTATNING' });
});

describe('Sykepengeerstatning', () => {
  beforeEach(() => {
    render(<Sykepengeerstatning readOnly={false} behandlingVersjon={0} />);
  });

  it('har en overskrift', () => {
    expect(screen.getByRole('heading', { name: '§ 11-13 AAP som sykepengeerstatning' })).toBeVisible();
  });

  it('har et begrunnelsesfelt', () => {
    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
  });

  /*
  it('har et datofelt', () => {
    expect(screen.getByRole('textbox', { name: 'Gjelder fra' })).toBeVisible();
  });*/

  it('har felt for krav på sykepengeerstatning', () => {
    expect(screen.getByRole('group', { name: 'Har brukeren krav på sykepengeerstatning?' })).toBeVisible();
  });

  it('skal vise valg for grunn når krav på sykeerstatning er oppfylt', async () => {
    const jaValg = screen.getByRole('radio', { name: 'Ja' });
    await user.click(jaValg);

    const grunnFelt = await screen.findByRole('group', { name: 'Velg én grunn' });
    expect(grunnFelt).toBeVisible();
  });

  it('skal ikke vise valg for grunn når krav på sykeerstatning ikke er oppfylt', async () => {
    expect(screen.queryByRole('group', { name: 'Velg én grunn' })).not.toBeInTheDocument();
    const neiValg = screen.getByRole('radio', { name: 'Nei' });
    await user.click(neiValg);
    expect(screen.queryByRole('group', { name: 'Velg én grunn' })).not.toBeInTheDocument();
  });

  it('skal ikke vise valg for grunn når krav på sykeerstatning ikke er besvart', async () => {
    const grunnFelt = screen.queryByRole('group', { name: 'Velg én grunn' });
    expect(grunnFelt).not.toBeInTheDocument();
  });

  it('skal vise feilmelding dersom begrunnelse ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText('Du må begrunne avgjørelsen din.');
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom krav på sykepengeerstatning ikke er besvart', async () => {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText(
      'Du må ta stilling til om brukeren har rett på AAP som sykepengeerstatning.'
    );
    expect(feilmelding).toBeVisible();
  });

  it('skal vise feilmelding dersom krav på sykepengeerstatning er oppfylt og grunn er ikke besvart', async () => {
    const jaValg = screen.getByRole('radio', { name: 'Ja' });
    await user.click(jaValg);

    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
    const feilmelding = await screen.findByText('Du må velge én grunn');
    expect(feilmelding).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.VURDER_SYKEPENGEERSTATNING_KODE,
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: SykepengeerstatningGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    kanVurderes: [],
    behøverVurderinger: [],
    vurderinger: [],
    vedtatteVurderinger: [],
    nyeVurderinger: [
      {
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        dokumenterBruktIVurdering: [],
        harRettPå: true,
        gjelderFra: '2025-01.01',
        fom: '2025-01.01',
        vurdertIBehandling: { id: 1 },
        opprettet: '2025-08-21',
        grunn: 'ANNEN_SYKDOM_INNEN_SEKS_MND',
        vurdertAv: {
          dato: '2025-08-21',
          ident: 'Saksbehandler',
        },
        besluttetAv: undefined,
        kvalitetssikretAv: undefined,
      },
    ],
    sisteVedtatteVurderinger: [
      {
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        dokumenterBruktIVurdering: [],
        harRettPå: true,
        gjelderFra: '2025-01.01',
        fom: '2025-01.01',
        vurdertIBehandling: { id: 1 },
        opprettet: '2025-08-21',
        grunn: 'ANNEN_SYKDOM_INNEN_SEKS_MND',
        vurdertAv: {
          dato: '2025-08-21',
          ident: 'Saksbehandler',
        },
        besluttetAv: undefined,
        kvalitetssikretAv: undefined,
      },
    ],
  };

  const grunnlagUtenVurdering: SykepengeerstatningGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    vurderinger: [],
    vedtatteVurderinger: [],
    nyeVurderinger: [],
    sisteVedtatteVurderinger: [],
    kanVurderes: [],
    behøverVurderinger: [],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <Sykepengeerstatning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(<Sykepengeerstatning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagUtenVurdering} />);

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
  });

  it('Skal ikke vise tekst om hvem som har gjort mellomlagring dersom bruker trykker på slett mellomlagring', async () => {
    render(
      <Sykepengeerstatning
        readOnly={false}
        behandlingVersjon={0}
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
      <Sykepengeerstatning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vilkårsvurdering',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<Sykepengeerstatning readOnly={false} behandlingVersjon={0} grunnlag={grunnlagMedVurdering} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Vilkårsvurdering',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <Sykepengeerstatning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagUtenVurdering}
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
      <Sykepengeerstatning
        readOnly={false}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
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
      <Sykepengeerstatning
        readOnly={true}
        behandlingVersjon={0}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const lagreKnapp = screen.queryByRole('button', { name: 'Lagre utkast' });
    expect(lagreKnapp).not.toBeInTheDocument();
    const slettKnapp = screen.queryByRole('button', { name: 'Slett utkast' });
    expect(slettKnapp).not.toBeInTheDocument();
  });
});
