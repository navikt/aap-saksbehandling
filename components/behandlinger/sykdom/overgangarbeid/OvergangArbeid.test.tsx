import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { OvergangArbeid } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid';
import { MellomlagretVurderingResponse, OvergangArbeidGrunnlag } from 'lib/types/types';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';
import { OvergangArbeidFormOld } from 'components/behandlinger/sykdom/overgangarbeid/OvergangArbeid-types';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

beforeEach(() => {
  setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'OVERGANG_ARBEID' });
});

const overgangArbeidgrunnlag: OvergangArbeidGrunnlag = {
  nyeVurderinger: [
    {
      begrunnelse: 'Dette er min vurdering som er bekreftet',
      brukerRettPåAAP: true,
      fom: '2025-08-19',
      vurdertAv: { ident: 'TESTER', dato: '2025-08-19' },
    },
  ],
  gjeldendeSykdsomsvurderinger: [],
  sisteVedtatteVurderinger: [],
  harTilgangTilÅSaksbehandle: true,
  behøverVurderinger: [],
  kanVurderes: [],
};

describe('mellomlagring i overgang arbeid', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: '5006',
      behandlingId: { id: 1 },
      data: '{ "vurderinger": [{"begrunnelse":"Dette er min vurdering som er mellomlagret","brukerRettPåAAP":"ja","virkningsdato": "2025-08-19"}] }',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <OvergangArbeid
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
      render(<OvergangArbeid behandlingVersjon={0} readOnly={false} />);

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
      <OvergangArbeid
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
      <OvergangArbeid
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={overgangArbeidgrunnlag}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal støtte å migrere mellomlagret vurdering på gammelt format', () => {
    const dataGammel: OvergangArbeidFormOld = {
      begrunnelse: 'dette en min gammel vurdering som er mellomlagret',
      brukerRettPåAAP: 'Ja',
      fom: '01.01.2026',
    };

    const mellomlagringGammel: MellomlagretVurderingResponse = {
      mellomlagretVurdering: {
        avklaringsbehovkode: '5006',
        behandlingId: { id: 1 },
        data: JSON.stringify(dataGammel),
        vurdertDato: '2025-08-21T12:00:00.000',
        vurdertAv: 'Jan T. Loven',
      },
    };

    render(
      <OvergangArbeid
        behandlingVersjon={0}
        readOnly={false}
        grunnlag={overgangArbeidgrunnlag}
        initialMellomlagretVurdering={mellomlagringGammel.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue(dataGammel.begrunnelse);
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(<OvergangArbeid behandlingVersjon={0} readOnly={false} grunnlag={overgangArbeidgrunnlag} />);

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: /vilkårsvurdering/i,
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <OvergangArbeid
        behandlingVersjon={0}
        readOnly={false}
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
      <OvergangArbeid
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overgangArbeidgrunnlag}
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
      <OvergangArbeid
        behandlingVersjon={0}
        readOnly={true}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
        grunnlag={overgangArbeidgrunnlag}
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
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} />);

    const heading = screen.getByText('§ 11-17 AAP i perioden som arbeidssøker');
    expect(heading).toBeVisible();
  });

  it('Skal ha felt for begrunnelse', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} />);
    const begrunnelse = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelse).toBeVisible();
  });

  it('Skal ha felt for om brukeren har rett på AAP', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} />);
    const felt = screen.getByRole('group', {
      name: 'Har brukeren rett på AAP i perioden som arbeidssøker etter § 11-17?',
    });
    expect(felt).toBeVisible();
  });

  it('Skal ha felt for virkningsdato', () => {
    render(<OvergangArbeid readOnly={false} behandlingVersjon={0} />);
    const felt = screen.queryByRole('textbox', {
      name: 'Vurderingen gjelder fra',
    });
    expect(felt).toBeVisible();
  });

  it('skal resette state i felt dersom Avbryt-knappen blir trykket', async () => {
    setMockFlytResponse({ ...defaultFlytResponse, aktivtSteg: 'AVKLAR_SYKDOM' });

    render(<OvergangArbeid grunnlag={overgangArbeidgrunnlag} readOnly={false} behandlingVersjon={0} />);

    const endreKnapp = screen.getByRole('button', { name: 'Endre' });
    await user.click(endreKnapp);

    await user.click(
      screen.getByRole('button', {
        name: /ny vurdering: 19. august 2025/i,
      })
    );

    const begrunnelseFelt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    await user.clear(begrunnelseFelt);
    await user.type(begrunnelseFelt, 'Dette er en ny begrunnelse');
    expect(begrunnelseFelt).toHaveValue('Dette er en ny begrunnelse');

    const avbrytKnapp = screen.getByRole('button', { name: 'Avbryt' });
    await user.click(avbrytKnapp);

    await user.click(
      screen.getByRole('button', {
        name: /ny vurdering: 19. august 2025/i,
      })
    );

    const begrunnelseFeltEtterAvbryt = screen.getByRole('textbox', { name: 'Vilkårsvurdering' });
    expect(begrunnelseFeltEtterAvbryt).toHaveValue('Dette er min vurdering som er bekreftet');
  });
});
