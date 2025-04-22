import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from 'lib/test/CustomRender';
import { Behovstype } from 'lib/utils/form';
import { TotrinnsvurderingForm } from 'components/totrinnsvurdering/totrinnsvurderingform/TotrinnsvurderingForm';
import { BehandlingFlytOgTilstand, FatteVedtakGrunnlag } from 'lib/types/types';
import { userEvent } from '@testing-library/user-event';
import createFetchMock from 'vitest-fetch-mock';
import { FetchResponse } from 'lib/utils/api';

const grunnlag: FatteVedtakGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vurderinger: [
    {
      definisjon: Behovstype.AVKLAR_SYKDOM_KODE,
    },
  ],
  historikk: [],
};

const link = `/sak/123/456`;

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe('totrinnsvurderingform', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('skal ha en overskrift som er en lenke til vilkårsvurderingen', () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const overskriftLenke = screen.getByRole('link', {
      name: '§ 11-5 Nedsatt arbeidsevne og krav til årsakssammenheng',
    });
    expect(overskriftLenke).toBeVisible();
    expect(overskriftLenke).toHaveAttribute('href', `${link}/SYKDOM#AVKLAR_SYKDOM`);
  });

  it('skal ha en radio group hvor beslutter kan godkjenne eller avslå vurderingen til saksbehandler/veileder', () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const godkjennValg = screen.getByRole('radio', { name: /ja/i });
    expect(godkjennValg).toBeVisible();

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    expect(vurderPåNyttValg).toBeVisible();
  });

  it('skal ha en knapp for å sende inn totrinnsvurderingene', () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    expect(knapp).toBeVisible();
  });

  it('skal dukke opp felt for begrunnelse dersom vurderingen har blitt avslått', async () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const begrunnelseFelt = await screen.getByRole('textbox', { name: /beskriv returårsak/i });
    expect(begrunnelseFelt).toBeVisible();
  });

  it('skal dukke opp felt for å velge grunner for avslag dersom vurderingen har blitt avslått', async () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
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
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const grunnerFelt = screen.getByRole('group', { name: /returårsak/i });
    expect(grunnerFelt).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis begrunnelse ikke har blitt besvart ved innsending', async () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(knapp);

    const errorMessage = screen.getByText('Du må gi en begrunnelse');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp feilmelding hvis ingen grunn har blitt valgt ved innsending', async () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const vurderPåNyttValg = screen.getByRole('radio', { name: /nei/i });
    await user.click(vurderPåNyttValg);

    const knapp = screen.getByRole('button', { name: /bekreft/i });
    await user.click(knapp);

    const errorMessage = await screen.getByText('Du må oppgi en grunn');
    expect(errorMessage).toBeVisible();
  });

  it('skal dukke opp et fritekst felt for å skrive inn en grunn dersom ANNET er valgt', async () => {
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
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
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
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
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
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
    mockFetchFlyt();
    render(
      <TotrinnsvurderingForm
        grunnlag={grunnlag}
        erKvalitetssikring={false}
        link={link}
        readOnly={false}
        behandlingsReferanse={'456'}
      />
    );

    const sendInnButton = screen.getByRole('button', { name: /bekreft/i });
    expect(screen.queryByText('Du må gjøre minst én vurdering.')).not.toBeInTheDocument();

    await user.click(sendInnButton);

    expect(screen.getByText('Du må gjøre minst én vurdering.')).toBeInTheDocument();
  });
});

function mockFetchFlyt() {
  const response: FetchResponse<BehandlingFlytOgTilstand> = {
    type: 'SUCCESS',
    status: 200,
    data: {
      behandlingVersjon: 5,
      aktivGruppe: 'START_BEHANDLING',
      aktivtSteg: 'START_BEHANDLING',
      aktivtStegDefinisjon: [],
      flyt: [],
      prosessering: {
        status: 'FERDIG',
        ventendeOppgaver: [],
      },
      visning: {
        beslutterReadOnly: false,
        kvalitetssikringReadOnly: false,
        saksbehandlerReadOnly: false,
        typeBehandling: 'Førstegangsbehandling',
        visBeslutterKort: false,
        visBrevkort: false,
        visKvalitetssikringKort: false,
        visVentekort: false,
      },
    },
  };

  fetchMock.mockResponse(JSON.stringify(response), { status: 200 });
}
