import { describe, expect, it } from 'vitest';
import { FastsettArbeidsevne } from 'components/behandlinger/sykdom/fastsettarbeidsevne/FastsettArbeidsevne';
import { render, screen, within } from 'lib/test/CustomRender';
import { userEvent } from '@testing-library/user-event';
import { ArbeidsevneGrunnlag } from 'lib/types/types';

describe('FastsettArbeidsevne', () => {
  const user = userEvent.setup();

  it('Skal ha riktig heading', () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    const heading = screen.getByRole('heading', {
      name: '§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet',
      level: 3,
    });
    expect(heading).toBeVisible();
  });

  it('Steget skal være default lukket', () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    expect(
      screen.queryByRole('textbox', {
        name: 'Vilkårsvurdering',
      })
    ).not.toBeInTheDocument();
  });

  it('steget er åpent for beslutter når det er gjort en vurdering (minst en vurdering og readOnly er true)', () => {
    const grunnlag: ArbeidsevneGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      vurderinger: [
        { begrunnelse: 'Grunn', fraDato: '2024-08-10', arbeidsevne: 80, vurderingsTidspunkt: '2024-08-10' },
      ],
      historikk: [],
      gjeldendeVedtatteVurderinger: [],
    };
    render(<FastsettArbeidsevne readOnly={true} behandlingVersjon={0} grunnlag={grunnlag} />);
    expect(screen.getByText('Vilkårsvurdering')).toBeVisible();
  });

  it('har et felt hvor saksbehandler skal begrunne om brukeren har arbeidsevne', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    await klikkPåNyVurdering();
    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
  });

  it('skal ikke vise bekreft knapp hvis det ikke er noen vurderinger', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();

    expect(screen.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();
  });

  it('skal vise bekreft knapp hvis det er noen vurderinger', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    expect(screen.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));

    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });

  it('begrunnelsesfeltet har en beskrivelse', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    await klikkPåNyVurdering();
    expect(
      screen.getByText(
        'Vurder om brukeren har en arbeidsevne som ikke er utnyttet. Hvis det ikke legges inn en vurdering, har brukeren rett på full ytelse.'
      )
    ).toBeVisible();
  });

  it('har et felt for å angi arbeidsevne', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    await klikkPåNyVurdering();
    expect(
      screen.getByRole('textbox', {
        name: 'Oppgi arbeidsevnen som ikke er utnyttet i prosent',
      })
    ).toBeVisible();
  });

  it('har et felt for å angi når arbeidsevnen gjelder fra', async () => {
    render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    await klikkPåNyVurdering();
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  describe('validering', () => {
    it('viser feilmelding dersom begrunnelse ikke er fylt ut', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må begrunne vurderingen din')).toBeVisible();
    });

    it('viser feilmelding når arbeidsevne ikke er besvart', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi hvor stor arbeidsevne brukeren har')).toBeVisible();
    });

    it('viser feilmelding dersom dato når arbeidsevnen gjelder fra ikke er besvart', async () => {
      render(<FastsettArbeidsevne readOnly={false} behandlingVersjon={0} />);
      await åpneVilkårskort();
      await klikkPåNyVurdering();
      await klikkPåBekreft();
      expect(screen.getByText('Du må angi datoen arbeidsevnen gjelder fra')).toBeVisible();
    });
  });

  async function klikkPåNyVurdering() {
    await user.click(screen.getByRole('button', { name: 'Legg til ny vurdering' }));
  }

  async function klikkPåBekreft() {
    const bekreftKnapp = screen.getByRole('button', { name: 'Bekreft' });
    await user.click(bekreftKnapp);
  }

  async function åpneVilkårskort() {
    const region = screen.getByRole('region', {
      name: '§ 11-23 andre ledd. Arbeidsevne som ikke er utnyttet',
    });
    const button = within(region).getByRole('button');
    await user.click(button);
  }
});
