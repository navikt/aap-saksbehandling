import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { Behovstype } from 'lib/utils/form';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { FatteVedtakGrunnlag, MellomlagretVurderingResponse } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import { FetchResponse } from 'lib/utils/api';
import createFetchMock from 'vitest-fetch-mock';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
const user = userEvent.setup();

const grunnlagUtenVurdering: FatteVedtakGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vurderinger: [
    {
      definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
    },
  ],
  historikk: [],
};

const link = `/sak/123/456`;

describe('totrinnsvurderingform', () => {
  const user = userEvent.setup();

  it('skal ha en overskrift som er en lenke til vilkårsvurderingen', () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const overskriftLenke = screen.getByRole('link', {
      name: '§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng',
    });
    expect(overskriftLenke).toBeVisible();
    expect(overskriftLenke).toHaveAttribute('href', `${link}/SYKDOM#AVKLAR_SYKDOM`);
  });

  it('skal ha en radio group hvor beslutter kan godkjenne eller avslå vurderingen til saksbehandler/veileder', () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const godkjennValg = screen.getByRole('radio', { name: /ja/i });
    expect(godkjennValg).toBeVisible();

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    expect(vurderPåNyttValg).toBeVisible();
  });

  it('skal ha en knapp for å sende inn totrinnsvurderingene', () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    expect(knapp).toBeVisible();
  });

  it('skal dukke opp felt for begrunnelse dersom vurderingen har blitt avslått', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const begrunnelseFelt = await screen.getByRole('textbox', { name: /beskriv returårsak/i });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal dukke opp felt for å velge grunner for avslag dersom vurderingen har blitt avslått', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const mangelfullBegrunnelse = screen.getByRole('checkbox', { name: /mangler i vilkårsvurderingen/i });
    const manglendeUtredning = screen.getByRole('checkbox', { name: /mangler i utredning før vilkårsvurderingen/i });
    const feilLovanvendelse = screen.getByRole('checkbox', { name: /feil resultat i vedtaket/i });
    const annet = screen.getByRole('checkbox', {
      name: /annen returgrunn/i,
    });

    expect(mangelfullBegrunnelse).toBeVisible();
    expect(manglendeUtredning).toBeVisible();
    expect(feilLovanvendelse).toBeVisible();
    expect(annet).toBeVisible();
  });

  it('skal ha riktige vlag i feltet for å velge grunner', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const grunnerFelt = screen.getByRole('group', { name: /returårsak/i });
    expect(grunnerFelt).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis begrunnelse ikke har blitt besvart ved innsending', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(knapp);

    const errorMessage = screen.getByText('Du må gi en begrunnelse');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis ingen grunn har blitt valgt ved innsending', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(knapp);

    const errorMessage = await screen.getByText('Du må oppgi en grunn');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp et fritekst felt for å skrive inn en grunn dersom ANNET er valgt', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const fritekstFelt = await screen.queryByRole('textbox', { name: /annen returgrunn/i });
    expect(fritekstFelt).not.toBeInTheDocument();

    const annetValg = screen.getByRole('checkbox', { name: /annen returgrunn/i });
    await user.click(annetValg);

    const fritekstFeltEtterAnnetErValgt = screen.getByRole('textbox', { name: /annen returgrunn/i });
    expect(fritekstFeltEtterAnnetErValgt).toBeVisible();
  });

  it('skal dukke opp error på fritekst felt for å skrive inn en grunn dersom ANNET er valgt og det ikke er besvart', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const fritekstFelt = await screen.queryByRole('textbox', { name: /annen returgrunn/i });
    expect(fritekstFelt).not.toBeInTheDocument();

    const annetValg = screen.getByRole('checkbox', { name: /annen returgrunn/i });
    await user.click(annetValg);

    const fritekstFeltEtterAnnetErValgt = await screen.queryByRole('textbox', { name: /annen returgrunn/i });
    expect(fritekstFeltEtterAnnetErValgt).toBeVisible();

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(knapp);

    const errorMessage = await screen.getByText('Du må skrive en grunn');
    expect(errorMessage).toBeVisible();
  });

  it('gir feilmelding hvis man velger en grunn for så å fjerne den igjen', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const begrunnelse = screen.getByRole('textbox', { name: 'Beskriv returårsak' });
    await user.type(begrunnelse, 'En grunn');
    const mangelfullBegrunnelse = screen.getByRole('checkbox', { name: 'Mangler i vilkårsvurderingen' });

    // Feilen kommer dersom man velger en grunn, for så å fjerne avkryssningen igjen
    await user.click(mangelfullBegrunnelse);
    expect(mangelfullBegrunnelse).toBeChecked();
    await user.click(mangelfullBegrunnelse);
    expect(mangelfullBegrunnelse).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Bekreft' }));
    expect(screen.getByText('Du må oppgi en grunn')).toBeVisible();
  });

  it('skal vise en feilmelding dersom det ikke har blitt gjort noen totrinnsvurdering og man prøver å send inn vurderingene', async () => {
    render(
      <TotrinnsvurderingForm grunnlag={grunnlagUtenVurdering} erKvalitetssikring={false} link={link} readOnly={false} />
    );

    const sendInnButton = screen.getByRole('button', { name: /bekreft/i });
    expect(screen.queryByText('Du må gjøre minst én vurdering.')).not.toBeInTheDocument();

    await user.click(sendInnButton);

    expect(screen.getByText('Du må gjøre minst én vurdering.')).toBeInTheDocument();
  });
});

describe('Totrinnsvurdering av vedtaksbrev', () => {
  const grunnlaget: FatteVedtakGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    vurderinger: [
      {
        definisjon: Behovstype.SYKDOMSVURDERING_BREV_KODE,
      },
    ],
    historikk: [],
  };
  it('har en egen beskrivelse for kvalitetssikring av vedtaksbrev', () => {
    render(<TotrinnsvurderingForm grunnlag={grunnlaget} erKvalitetssikring={true} link={link} readOnly={false} />);
    expect(screen.getByText('Godkjenner du begrunnelsen?')).toBeVisible();
  });

  it('har egne grunner for retur', async () => {
    render(<TotrinnsvurderingForm grunnlag={grunnlaget} erKvalitetssikring={true} link={link} readOnly={false} />);

    await user.click(screen.getByRole('radio', { name: /Nei/ }));

    expect(screen.getByRole('checkbox', { name: /Skrivefeil/ })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: /For detaljerte beskrivelser/ })).toBeVisible();
    expect(screen.getByRole('checkbox', { name: /Ikke individuell og konkret nok/ })).toBeVisible();
  });
});

describe('mellomlagring', () => {
  const mellomlagring: MellomlagretVurderingResponse = {
    mellomlagretVurdering: {
      avklaringsbehovkode: Behovstype.KVALITETSSIKRING_KODE,
      behandlingId: { id: 1 },
      data: '{"totrinnsvurderinger":[{"definisjon":"5003","godkjent":"false","begrunnelse":"Dette er min vurdering som er mellomlagret","grunner":[],"årsakFritekst":""}]}',
      vurdertDato: '2025-08-21T12:00:00.000',
      vurdertAv: 'Jan T. Loven',
    },
  };

  const grunnlagMedVurdering: FatteVedtakGrunnlag = {
    harTilgangTilÅSaksbehandle: true,
    historikk: [],
    vurderinger: [
      {
        definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
        begrunnelse: 'Dette er min vurdering som er bekreftet',
        godkjent: false,
      },
    ],
  };

  it('Skal vise en tekst om hvem som har gjort vurderingen dersom det finnes en mellomlagring', () => {
    render(
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );
    const tekst = screen.getByText('Utkast lagret 21.08.2025 12:00 (Jan T. Loven)');
    expect(tekst).toBeVisible();
  });

  it('Skal vise en tekst om hvem som har lagret vurdering dersom bruker trykker på lagre mellomlagring', async () => {
    render(
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagUtenVurdering}
      />
    );
    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    await user.type(
      screen.getByRole('textbox', { name: 'Beskriv returårsak' }),
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
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
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
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Beskriv returårsak',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er mellomlagret');
  });

  it('Skal bruke bekreftet vurdering fra grunnlag som defaultValue i skjema dersom mellomlagring ikke finnes', () => {
    render(
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagMedVurdering}
      />
    );

    const begrunnelseFelt = screen.getByRole('textbox', {
      name: 'Beskriv returårsak',
    });

    expect(begrunnelseFelt).toHaveValue('Dette er min vurdering som er bekreftet');
  });

  it('Skal resette skjema til tomt skjema dersom det ikke finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagUtenVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Beskriv returårsak' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Beskriv returårsak' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.queryByRole('textbox', { name: 'Beskriv returårsak' })).not.toBeInTheDocument();
  });

  it('Skal resette skjema til bekreftet vurdering dersom det finnes en bekreftet vurdering og bruker sletter mellomlagring', async () => {
    render(
      <TotrinnsvurderingForm
        readOnly={false}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
        grunnlag={grunnlagMedVurdering}
        initialMellomlagretVurdering={mellomlagring.mellomlagretVurdering}
      />
    );

    await user.type(screen.getByRole('textbox', { name: 'Beskriv returårsak' }), ' her er ekstra tekst');

    expect(screen.getByRole('textbox', { name: 'Beskriv returårsak' })).toHaveValue(
      'Dette er min vurdering som er mellomlagret her er ekstra tekst'
    );

    const slettKnapp = screen.getByRole('button', { name: 'Slett utkast' });

    await user.click(slettKnapp);

    expect(screen.getByRole('textbox', { name: 'Beskriv returårsak' })).toHaveValue(
      'Dette er min vurdering som er bekreftet'
    );
  });

  it('Skal ikke være mulig å lagre eller slette mellomlagring hvis det er readOnly', () => {
    render(
      <TotrinnsvurderingForm
        readOnly={true}
        link={'/mitt-avklaringsbehov'}
        erKvalitetssikring={false}
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
