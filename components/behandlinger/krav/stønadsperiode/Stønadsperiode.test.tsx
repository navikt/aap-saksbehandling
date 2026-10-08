import { describe, expect, it } from 'vitest';
import { screen, within } from 'lib/test/CustomRender';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StønadsperiodeGrunnlag, StønadsperiodeVurdering } from 'lib/types/types';
import { Stønadsperiode } from './Stønadsperiode';

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
    ).toBeChecked();
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

  it('skjuler endre-knappene i lesemodus, men beholder tabellinnholdet', () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);

    expect(screen.getByRole('row', { name: /vedtatt-krav/ })).toBeVisible();
    expect(screen.getByRole('row', { name: /nytt-krav/ })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skjuler også en allerede åpen boks når komponenten går over i lesemodus', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    await user.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeVisible();

    rerender(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
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
    ).toBeChecked();
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
    ).toBeChecked();
    expect(
      within(gjenåpnet.getByRole('radiogroup', { name: 'Har brukeren gjenværende kvote?' })).getByRole('radio', {
        name: 'Ja',
      })
    ).toBeChecked();
    expect(gjenåpnet.queryByText('Du må skrive en begrunnelse.')).not.toBeInTheDocument();
    expect(gjenåpnet.queryByText('Du må sette en dato kravet skal vurderes fra.')).not.toBeInTheDocument();
  });

  it('viser feil for ugyldig dato og fjerner den når datoen rettes', async () => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    await user.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    const dato = screen.getByRole('textbox', { name: 'Dato kravet skal vurderes fra' });
    await user.clear(dato);
    await user.type(dato, '32.13.2025');
    expect(await screen.findByText('Datoen er ikke gyldig')).toBeVisible();
    await user.clear(dato);
    await user.type(dato, '20.05.2025');
    expect(screen.queryByText('Datoen er ikke gyldig')).not.toBeInTheDocument();
  });
});
