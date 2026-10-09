import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen, within } from 'lib/test/CustomRender';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MellomlagretVurdering, StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { Stønadsperiode } from './Stønadsperiode';
import { byggInitielleStønadsperiodeVurderinger, StønadsperiodeFormFields } from '../utils/stønadsperiodeutils';
import { Behovstype } from 'lib/utils/form';
import { defaultFlytResponse, setMockFlytResponse } from 'vitestSetup';

const { refetchBekreftVurderingerGrunnlagClient } = vi.hoisted(() => ({
  refetchBekreftVurderingerGrunnlagClient: vi.fn(),
}));

vi.mock('hooks/saksbehandling/BekrefteVurderingerHook', () => ({
  useBekreftVurderingerGrunnlag: () => ({ refetchBekreftVurderingerGrunnlagClient }),
}));

function vurdering(referanse: string): StønadsperiodeVurdering {
  return {
    referanse,
    begrunnelse: 'Opprinnelig vurdering',
    harGjenværendeKvote: true,
    harHattOrdinærSiste52Uker: false,
    opprettet: '2025-04-01T10:30:00Z',
    relevantKravType: { type: 'NY_STØNADSPERIODE' },
    startDato: '2025-04-15',
    vurdertAv: 'Z000000',
    vurdertIBehandling: { id: 1 },
  };
}

const grunnlag: StønadsperiodeGrunnlag = {
  harTilgangTilÅSaksbehandle: true,
  vedtatteVurderinger: [vurdering('vedtatt-krav')],
  nyeVurderinger: [vurdering('nytt-krav')],
};

describe('Stønadsperiode - endre krav', () => {
  it('viser tabellen uten åpne bokser i utgangspunktet', () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);

    expect(screen.getAllByRole('button', { name: 'Endre' })).toHaveLength(2);
    expect(screen.queryByRole('textbox', { name: 'Begrunnelse' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lukk' })).not.toBeInTheDocument();
  });

  it.each(['vedtatt-krav', 'nytt-krav'])('åpner skjemaet for %s med eksisterende verdier', async (referanse) => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const rad = screen.getByRole('row', { name: new RegExp(referanse) });

    await user.click(within(rad).getByRole('button', { name: 'Endre' }));

    expect(screen.getByText(`Vurder krav ${referanse}`)).toBeVisible();
    expect(screen.getByText('Søknadsdato: 15.04.2025')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Opprinnelig vurdering');
    expect(screen.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' })).toHaveValue('15.04.2025');
    expect(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        {
          name: 'Nei',
        }
      )
    ).not.toBeChecked();
    expect(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    ).toBeChecked();
    expect(within(rad).getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });

  it('kan åpne flere bokser og lukke bare valgt krav med Avbryt eller Lukk', async () => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const vedtattRad = screen.getByRole('row', { name: /vedtatt-krav/ });
    const nyRad = screen.getByRole('row', { name: /nytt-krav/ });

    await user.click(within(vedtattRad).getByRole('button', { name: 'Endre' }));
    await user.click(within(nyRad).getByRole('button', { name: 'Endre' }));
    expect(screen.getAllByRole('textbox', { name: 'Begrunnelse' })).toHaveLength(2);

    await user.click(within(vedtattRad).getByRole('button', { name: 'Avbryt' }));
    expect(screen.queryByText('Vurder krav vedtatt-krav')).not.toBeInTheDocument();
    expect(screen.getByText('Vurder krav nytt-krav')).toBeVisible();
    expect(within(vedtattRad).getByRole('button', { name: 'Endre' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Lukk' }));
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(within(nyRad).getByRole('button', { name: 'Endre' })).toBeVisible();

    await user.click(within(nyRad).getByRole('button', { name: 'Endre' }));
    expect(screen.getAllByText('Vurder krav nytt-krav')).toHaveLength(1);
    expect(screen.getAllByRole('textbox', { name: 'Begrunnelse' })).toHaveLength(1);
  });

  it('viser bare én boks når nye og vedtatte vurderinger har samme kravreferanse', async () => {
    const user = userEvent.setup();
    const fellesGrunnlag: StønadsperiodeGrunnlag = {
      ...grunnlag,
      vedtatteVurderinger: [vurdering('felles-krav')],
      nyeVurderinger: [vurdering('felles-krav')],
    };
    render(<Stønadsperiode grunnlag={fellesGrunnlag} behandlingVersjon={0} readOnly={false} />);

    await user.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    expect(screen.getAllByText('Vurder krav felles-krav')).toHaveLength(1);
    expect(screen.getAllByRole('textbox', { name: 'Begrunnelse' })).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: 'Avbryt' })[1]);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('beholder dagens endre-knapper i lesemodus', () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);

    expect(screen.getByRole('row', { name: /vedtatt-krav/ })).toBeVisible();
    expect(screen.getByRole('row', { name: /nytt-krav/ })).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Endre' })).toHaveLength(2);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('beholder en allerede åpen boks når komponenten går over i lesemodus', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    await user.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();

    rerender(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeVisible();
  });

  it('holder alle fire felter isolert per krav og bevarer endringer ved rerender og åpning av andre bokser', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const vedtattRad = screen.getByRole('row', { name: /vedtatt-krav/ });
    await user.click(within(vedtattRad).getByRole('button', { name: 'Endre' }));
    const vedtattBoks = within(screen.getByRole('group', { name: 'Vurder krav vedtatt-krav' }));
    await user.clear(vedtattBoks.getByRole('textbox', { name: 'Begrunnelse' }));
    await user.type(vedtattBoks.getByRole('textbox', { name: 'Begrunnelse' }), 'Endret vurdering');
    await user.clear(vedtattBoks.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' }));
    await user.type(vedtattBoks.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' }), '20.05.2025');
    await user.click(
      within(vedtattBoks.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Ja' }
      )
    );
    await user.click(
      within(vedtattBoks.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Nei',
      })
    );

    await user.click(within(screen.getByRole('row', { name: /nytt-krav/ })).getByRole('button', { name: 'Endre' }));
    const nyBoks = within(screen.getByRole('group', { name: 'Vurder krav nytt-krav' }));
    expect(nyBoks.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Opprinnelig vurdering');
    expect(nyBoks.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' })).toHaveValue('15.04.2025');
    expect(
      within(nyBoks.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        {
          name: 'Nei',
        }
      )
    ).not.toBeChecked();
    expect(
      within(nyBoks.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    ).toBeChecked();

    await user.click(nyBoks.getByRole('button', { name: 'Lukk' }));
    rerender(<Stønadsperiode grunnlag={{ ...grunnlag }} behandlingVersjon={1} readOnly={false} />);
    expect(vedtattBoks.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Endret vurdering');
    expect(vedtattBoks.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' })).toHaveValue('20.05.2025');
    expect(
      within(vedtattBoks.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Ja' }
      )
    ).toBeChecked();
    expect(
      within(vedtattBoks.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Nei',
      })
    ).toBeChecked();
  });

  it.each(['Avbryt', 'Lukk'])('%s nullstiller bare valgt krav', async (knapp) => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const vedtattRad = screen.getByRole('row', { name: /vedtatt-krav/ });
    await user.click(within(vedtattRad).getByRole('button', { name: 'Endre' }));
    await user.click(within(screen.getByRole('row', { name: /nytt-krav/ })).getByRole('button', { name: 'Endre' }));
    const nyBoks = within(screen.getByRole('group', { name: 'Vurder krav nytt-krav' }));
    await user.type(nyBoks.getByRole('textbox', { name: 'Begrunnelse' }), ' behold');
    const boks = within(screen.getByRole('group', { name: 'Vurder krav vedtatt-krav' }));
    await user.clear(boks.getByRole('textbox', { name: 'Begrunnelse' }));
    await user.clear(boks.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' }));
    await user.click(
      within(boks.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        {
          name: 'Ja',
        }
      )
    );
    await user.click(
      within(boks.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Nei',
      })
    );
    await user.click((knapp === 'Avbryt' ? within(vedtattRad) : boks).getByRole('button', { name: knapp }));
    expect(nyBoks.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Opprinnelig vurdering behold');
    await user.click(within(vedtattRad).getByRole('button', { name: 'Endre' }));
    const gjenåpnet = within(screen.getByRole('group', { name: 'Vurder krav vedtatt-krav' }));
    expect(gjenåpnet.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Opprinnelig vurdering');
    expect(gjenåpnet.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' })).toHaveValue('15.04.2025');
    expect(
      within(gjenåpnet.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Nei' }
      )
    ).not.toBeChecked();
    expect(
      within(gjenåpnet.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    ).toBeChecked();
    expect(gjenåpnet.queryByText('Du må skrive en begrunnelse.')).not.toBeInTheDocument();
    expect(gjenåpnet.queryByText('Du må sette en dato kravet skal vurderes fra.')).not.toBeInTheDocument();
  });
});

describe('Stønadsperiode - mellomlagring', () => {
  const innlastedeVerdier: StønadsperiodeFormFields = {
    valgteKrav: ['nytt-krav'],
    vurderinger: {
      ...byggInitielleStønadsperiodeVurderinger(grunnlag),
      'nytt-krav': {
        begrunnelse: 'Mellomlagret begrunnelse',
        brukerenHarHattOrdinærAAPInnen52Uker: 'ja',
        harGjenværendeKvote: 'nei',
        datoKravetSkalVurderesFra: '20.05.2025',
      },
    },
  };
  const utkast: MellomlagretVurdering = {
    avklaringsbehovkode: Behovstype.AVKLAR_STØNADSPERIODE_KODE,
    behandlingId: { id: 1 },
    data: JSON.stringify(innlastedeVerdier),
    vurdertDato: '2025-08-21T12:00:00.000',
    vurdertAv: 'Z000000',
  };
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          type: 'SUCCESS',
          data: { mellomlagretVurdering: utkast },
        })
      )
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  async function autosave() {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
  }

  function lagretRequest(): StønadsperiodeFormFields {
    const request = fetchMock.mock.lastCall?.[1];
    expect(fetchMock.mock.lastCall?.[0]).toBe('/saksbehandling/api/mellomlagring');
    expect(request?.method).toBe('POST');
    const body = JSON.parse(String(request?.body));
    expect(body.avklaringsbehovkode).toBe('5039');
    expect(body.behandlingsReferanse).toBe('456');
    return JSON.parse(body.data);
  }

  it('gjenoppretter åpne bokser og alle feltene uten å lagre uendret utkast', async () => {
    render(
      <Stønadsperiode
        grunnlag={grunnlag}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={utkast}
      />
    );
    expect(screen.getByRole('group', { name: 'Vurder krav nytt-krav' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Mellomlagret begrunnelse');
    expect(screen.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' })).toHaveValue('20.05.2025');
    expect(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren hatt ordinær AAP innen 52 uker?' })).getByRole(
        'radio',
        { name: 'Ja' }
      )
    ).toBeChecked();
    expect(
      within(screen.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Nei',
      })
    ).toBeChecked();
    expect(screen.getByText(/Utkast lagret.*Z000000/)).toBeVisible();
    await autosave();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mellomlagrer åpning alene og viser utkastinfo etter faktisk autosave', async () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    fireEvent.click(within(screen.getByRole('row', { name: /nytt-krav/ })).getByRole('button', { name: 'Endre' }));
    expect(fetchMock).not.toHaveBeenCalled();
    await autosave();
    expect(lagretRequest()).toEqual({
      valgteKrav: ['nytt-krav'],
      vurderinger: JSON.parse(JSON.stringify(byggInitielleStønadsperiodeVurderinger(grunnlag))),
    });
    expect(screen.getByText(/Utkast lagret.*Z000000/)).toBeVisible();
  });

  it.each(['Avbryt', 'Lukk'])('mellomlagrer isolerte endringer og nullstilling ved %s', async (knapp) => {
    render(
      <Stønadsperiode
        grunnlag={grunnlag}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={utkast}
      />
    );
    fireEvent.click(within(screen.getByRole('row', { name: /vedtatt-krav/ })).getByRole('button', { name: 'Endre' }));
    const vedtatt = within(screen.getByRole('group', { name: 'Vurder krav vedtatt-krav' }));
    const ny = within(screen.getByRole('group', { name: 'Vurder krav nytt-krav' }));
    fireEvent.change(vedtatt.getByRole('textbox', { name: 'Begrunnelse' }), { target: { value: 'Endret vedtatt' } });
    fireEvent.change(ny.getByRole('textbox', { name: 'Begrunnelse' }), { target: { value: 'Endret ny' } });
    await autosave();
    expect(lagretRequest().vurderinger['vedtatt-krav'].begrunnelse).toBe('Endret vedtatt');
    expect(lagretRequest().vurderinger['nytt-krav'].begrunnelse).toBe('Endret ny');
    fireEvent.click(
      (knapp === 'Lukk' ? vedtatt : within(screen.getByRole('row', { name: /vedtatt-krav/ }))).getByRole('button', {
        name: knapp,
      })
    );
    await autosave();
    expect(lagretRequest()).toEqual({
      valgteKrav: ['nytt-krav'],
      vurderinger: {
        ...JSON.parse(JSON.stringify(byggInitielleStønadsperiodeVurderinger(grunnlag))),
        'nytt-krav': { ...innlastedeVerdier.vurderinger['nytt-krav'], begrunnelse: 'Endret ny' },
      },
    });
  });

  it('sletter utkast, resetter til innlastede verdier og avbryter ventende autosave', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ type: 'SUCCESS', data: null })));
    render(
      <Stønadsperiode
        grunnlag={grunnlag}
        behandlingVersjon={0}
        readOnly={false}
        initialMellomlagretVurdering={utkast}
      />
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Begrunnelse' }), { target: { value: 'Ikke lagret ennå' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Slett utkast' }));
    });
    expect(fetchMock).toHaveBeenCalledWith('/saksbehandling/api/mellomlagring', {
      method: 'DELETE',
      body: JSON.stringify({ behandlingsreferanse: '456', behovstype: '5039' }),
    });
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toHaveValue('Mellomlagret begrunnelse');
    expect(screen.queryByText(/Utkast lagret/)).not.toBeInTheDocument();
    await autosave();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('resetter til grunnlaget og lukker bokser ved sletting uten innlastet utkast', async () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    await autosave();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ type: 'SUCCESS', data: null })));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Slett utkast' }));
    });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByText(/Utkast lagret/)).not.toBeInTheDocument();
    await autosave();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('viser utkastinfo på vent i readOnly uten slett-knapp, men beholder dagens redigering', () => {
    setMockFlytResponse({ ...defaultFlytResponse, visning: { ...defaultFlytResponse.visning, visVentekort: true } });
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly initialMellomlagretVurdering={utkast} />);
    expect(screen.getByText(/Utkast lagret/)).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Slett utkast' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).not.toHaveAttribute('readonly');
  });
});
