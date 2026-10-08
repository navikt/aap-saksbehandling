import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
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
    expect(screen.queryByText('Under utvikling')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Lukk' })).not.toBeInTheDocument();
  });

  it.each(['vedtatt-krav', 'nytt-krav'])('åpner plassholderen for %s uten skjemafelt', async (referanse) => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const rad = screen.getByRole('row', { name: new RegExp(referanse) });

    await user.click(within(rad).getByRole('button', { name: 'Endre' }));

    expect(screen.getByText(`Vurder krav ${referanse}`)).toBeVisible();
    expect(screen.getByText('Vurderes fra: 15.04.2025')).toBeVisible();
    expect(screen.getByText('Under utvikling')).toBeVisible();
    expect(within(rad).getByRole('button', { name: 'Avbryt' })).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('kan åpne flere bokser og lukke bare valgt krav med Avbryt eller Lukk', async () => {
    const user = userEvent.setup();
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    const vedtattRad = screen.getByRole('row', { name: /vedtatt-krav/ });
    const nyRad = screen.getByRole('row', { name: /nytt-krav/ });

    await user.click(within(vedtattRad).getByRole('button', { name: 'Endre' }));
    await user.click(within(nyRad).getByRole('button', { name: 'Endre' }));
    expect(screen.getAllByText('Under utvikling')).toHaveLength(2);

    await user.click(within(vedtattRad).getByRole('button', { name: 'Avbryt' }));
    expect(screen.queryByText('Vurder krav vedtatt-krav')).not.toBeInTheDocument();
    expect(screen.getByText('Vurder krav nytt-krav')).toBeVisible();
    expect(within(vedtattRad).getByRole('button', { name: 'Endre' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Lukk' }));
    expect(screen.queryByText('Under utvikling')).not.toBeInTheDocument();
    expect(within(nyRad).getByRole('button', { name: 'Endre' })).toBeVisible();

    await user.click(within(nyRad).getByRole('button', { name: 'Endre' }));
    expect(screen.getAllByText('Vurder krav nytt-krav')).toHaveLength(1);
    expect(screen.getAllByText('Under utvikling')).toHaveLength(1);
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
    expect(screen.getAllByText('Under utvikling')).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: 'Avbryt' })[1]);
    expect(screen.queryByText('Under utvikling')).not.toBeInTheDocument();
  });

  it('skjuler endre-knappene i lesemodus, men beholder tabellinnholdet', () => {
    render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);

    expect(screen.getByRole('row', { name: /vedtatt-krav/ })).toBeVisible();
    expect(screen.getByRole('row', { name: /nytt-krav/ })).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
    expect(screen.queryByText('Under utvikling')).not.toBeInTheDocument();
  });

  it('skjuler også en allerede åpen boks når komponenten går over i lesemodus', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly={false} />);
    await user.click(screen.getAllByRole('button', { name: 'Endre' })[0]);
    expect(screen.getByText('Under utvikling')).toBeVisible();

    rerender(<Stønadsperiode grunnlag={grunnlag} behandlingVersjon={0} readOnly />);
    expect(screen.queryByText('Under utvikling')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
  });
});
