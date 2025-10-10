import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { OvergangUfore } from 'components/behandlinger/sykdom/overgangufore/OvergangUfore';
import { within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { MellomlagretVurderingResponse, OvergangUforeGrunnlag } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'OVERGANG_UFORE' });
});

describe('mellomlagring i overgang uføre', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5031',
      behandlingId: { id: 1 },
      data: '{"begrunnelse":"Dette er min vurdering som er mellomlagret","brukerRettPåAAP":"ja","brukerHarSøktOmUføretrygd":"ja","brukerHarFåttVedtakOmUføretrygd": "NEI"}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const overgangUføregrunnlag: OvergangUforeGrunnlag = {
    vurdering: {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      brukerRettPåAAP: true,
      brukerHarSøktUføretrygd: true,
      brukerHarFåttVedtakOmUføretrygd: 'NEI',
      vurdertAv: { ident: 'TESTER', dato: '2025-08-19' },
    },
    gjeldendeSykdsomsvurderinger: [],
    gjeldendeVedtatteVurderinger: [],
    harTilgangTilÅSaksbehandle: true,
    historiskeVurderinger: [],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <OvergangUfore
        readOnly={false}
        behandlingVersjon={0}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it(
    'Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre ' + 'mellomlagring',
    async () => {
      render(<OvergangUfore behandlingVersjon={0} readOnly={false} typeBehandling={'Førstegangsbehandling'} />);

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
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
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
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={overgangUføregrunnlag}
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
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        grunnlag={overgangUføregrunnlag}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
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
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={false}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overgangUføregrunnlag}
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
      <OvergangUfore
        behandlingVersjon={0}
        readOnly={true}
        typeBehandling={'Førstegangsbehandling'}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overgangUføregrunnlag}
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
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    const heading = screen.getByText('§ 11-18 AAP under behandling av krav om uføretrygd');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har søkt om uføretrygd', () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    const felt = screen.getByRole('group', {
      name: 'Har brukeren søkt om uføretrygd?',
    });
    expect(felt).toBeVisible();
  });

  it('Viser felt om brukeren har fått vedtak om uføretrygd, dersom brukeren ikke har søkt', async () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);

    expect(finnGruppeForSoktOmUforetrygd()).toBeVisible();

    await velgJa(finnGruppeForSoktOmUforetrygd());
    expect(finnGruppeForVedtakOmUforetrygd()).toBeVisible();
  });

  it('Har brukeren rett på AAP under behandling av krav om uføretrygd etter § 11-18?', async () => {
    render(<OvergangUfore readOnly={false} behandlingVersjon={0} typeBehandling={'Førstegangsbehandling'} />);
    await velgJa(finnGruppeForSoktOmUforetrygd());
    expect(finnGruppeForRettPåAAP()).toBeVisible();
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
