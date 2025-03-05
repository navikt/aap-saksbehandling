import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Meldeplikt } from 'components/behandlinger/sykdom/meldeplikt/Meldeplikt';
import { FritakMeldepliktGrunnlag } from 'lib/types/types';

const user = userEvent.setup();

describe('Meldeplikt', () => {
  it('har overskrift for å identifisere steget', () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    expect(screen.getByRole('heading', { name: 'Unntak fra meldeplikt § 11-10 (valgfritt)' })).toBeVisible();
  });

  it('er lukket initielt', () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    expect(
      screen.queryByRole('textbox', { name: 'Vurder brukers behov for fritak fra meldeplikt' })
    ).not.toBeInTheDocument();
  });

  it('vises som åpent når det skal kvalitetssikres (readOnly er true og minst en vurdering finnes)', () => {
    const meldepliktGrunnlag: FritakMeldepliktGrunnlag = {
      vurderinger: [
        {
          begrunnelse: 'Grunn',
          fraDato: '2024-08-10',
          harFritak: true,
          vurderingsTidspunkt: '2024-08-10',
        },
      ],
      gjeldendeVedtatteVurderinger: [],
      historikk: [],
    };
    render(<Meldeplikt behandlingVersjon={0} readOnly={true} grunnlag={meldepliktGrunnlag} />);
    expect(screen.queryByRole('textbox', { name: 'Vurder brukers behov for fritak fra meldeplikt' })).toBeVisible();
  });

  it('har et felt for begrunnelse', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Vurder brukers behov for fritak fra meldeplikt' })).toBeVisible();
  });

  it('har valg for å avgjøre om bruker skal få fritak fra meldeplikt eller ikke', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    expect(screen.getByRole('group', { name: 'Skal bruker få fritak fra meldeplikt?' })).toBeVisible();
  });

  it('har et valg for å si at bruker skal få fritak fra meldeplikt', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal bruker få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Ja' })).toBeVisible();
  });

  it('har et valg for å si at bruker ikke skal ha fritak fra meldeplikt', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    const fritakGruppe = screen.getByRole('group', { name: 'Skal bruker få fritak fra meldeplikt?' });
    expect(within(fritakGruppe).getByRole('radio', { name: 'Nei' })).toBeVisible();
  });

  it('har et felt for å fylle inn en dato for når vurderingen gjelder fra', async () => {
    render(<Meldeplikt behandlingVersjon={0} readOnly={false} />);
    await åpneVilkårskort();
    expect(screen.getByRole('textbox', { name: 'Vurderingen gjelder fra' })).toBeVisible();
  });
});

async function åpneVilkårskort() {
  const region = screen.getByRole('region', { name: 'Unntak fra meldeplikt § 11-10 (valgfritt)' });
  const button = within(region).getByRole('button');
  await user.click(button);
}
