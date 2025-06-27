import { describe, expect, it } from 'vitest';
import { render, screen, within } from 'lib/test/CustomRender';
import userEvent from '@testing-library/user-event';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';

const user = userEvent.setup();

describe('Meldeplikt', () => {
  it('har overskrift for å identifisere steget', () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByRole('heading', { name: '§ 11-10 tredje ledd. Unntak fra meldeplikt' })).toBeVisible();
  });

  it('er lukket initielt', () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).not.toBeInTheDocument();
  });

  it('vises som åpent når det skal kvalitetssikres (readOnly er true og minst en vurdering finnes)', () => {
    const meldepliktGrunnlag: FritakMeldepliktGrunnlag = {
      harTilgangTilÅSaksbehandle: true,
      vurderinger: [
        {
          begrunnelse: 'Grunn',
          fraDato: '2024-08-10',
          harFritak: true,
          vurdertAv: { ident: 'saksbehandler', dato: '2024-08-10' },
          vurderingsTidspunkt: '2024-08-10',
        },
      ],
      gjeldendeVedtatteVurderinger: [],
      historikk: [],
    };
    render(<Meldeplikt behandlingVersjon={0} readOnly={true} grunnlag={meldepliktGrunnlag} />);
    expect(screen.queryByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
  });

  it('har et felt for begrunnelse', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    await klikkPåNyPeriode();
    expect(screen.getByRole('textbox', { name: 'Vilkårsvurdering' })).toBeVisible();
  });

  it('har valg for å avgjøre om brukeren skal få fritak fra meldeplikt eller ikke', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    await klikkPåNyPeriode();
    expect(screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' })).toBeVisible();
  });

  it('har et valg for å si at brukeren skal få fritak fra meldeplikt', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    await klikkPåNyPeriode();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Ja' })).toBeVisible();
  });

  it('har et valg for å si at brukeren ikke skal ha fritak fra meldeplikt', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    await klikkPåNyPeriode();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal brukeren få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Nei' })).toBeVisible();
  });

  it('har et felt for å fylle inn en dato for når vurderingen gjelder fra', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    await klikkPåNyPeriode();
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });

  it('skal ikke vise bekreft knapp hvis det ikke er noen vurderinger', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();

    expect(screen.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();
  });

  it('skal vise bekreft knapp hvis det er noen vurderinger', async () => {
    render(<Meldeplikt readOnly={false} behandlingVersjon={0} />);
    await åpneVilkårskort();
    expect(screen.queryByRole('button', { name: 'Bekreft' })).not.toBeInTheDocument();

    await klikkPåNyPeriode();

    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeVisible();
  });
});

async function klikkPåNyPeriode() {
  await user.click(screen.getByRole('button', { name: 'Legg til periode' }));
}

async function åpneVilkårskort() {
  const region = screen.getByRole('region', { name: '§ 11-10 tredje ledd. Unntak fra meldeplikt' });
  const button = within(region).getByRole('button');
  await user.click(button);
}
